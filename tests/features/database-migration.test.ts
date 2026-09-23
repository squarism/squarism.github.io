import { describe, expect, it } from "vitest";
import {
  HEALTH_SECS,
  MAX_SERVERS,
  OP_SECS,
  Sim,
  UPGRADE_SECS,
  joinName,
  splitName,
  type Server,
} from "@/features/database-migration/sim";

const TICK = 1 / 60;

// a deterministic sequence so reads and writes are predictable. the sim
// draws once for read/write, once for the row, once for jitter, and once
// for the new name on a write.
function seq(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

function make(random: () => number = seq([0.5])): Sim {
  return new Sim({ random, rows: 6 });
}

function run(sim: Sim, seconds: number): void {
  const steps = Math.round(seconds / TICK);
  for (let i = 0; i < steps; i++) sim.step(TICK);
}

function runOp(sim: Sim, id: Parameters<Sim["runOp"]>[0], seconds: number): void {
  expect(sim.runOp(id)).toBe(true);
  run(sim, seconds);
  expect(sim.op).toBeNull();
}

function lastLog(sim: Sim): string {
  return sim.log[0]?.msg ?? "";
}

const COPY_ALL = OP_SECS.copyRow * 6 + 0.5;

describe("helpers", () => {
  it("splits and joins two-word names", () => {
    expect(splitName("Ada Lovelace")).toEqual(["Ada", "Lovelace"]);
    expect(splitName("Prince")).toEqual(["Prince", ""]);
    expect(joinName("Ada", "Lovelace")).toBe("Ada Lovelace");
    expect(joinName(null, "x")).toBeNull();
  });
});

describe("starting state", () => {
  it("has two v1 servers, the split columns, and consistent rows", () => {
    const sim = make();
    expect(sim.servers.map(s => [s.name, s.version])).toEqual([
      ["web-01", 1],
      ["web-02", 1],
    ]);
    expect(sim.columns).toEqual({
      name: false,
      firstName: true,
      lastName: true,
    });
    expect(sim.rows).toHaveLength(6);
    expect(sim.outOfSync).toHaveLength(0);
    expect(sim.done).toBe(false);
  });

  it("serves v1 traffic cleanly", () => {
    const sim = make();
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 5);
    expect(sim.handled).toBeGreaterThan(10);
    expect(sim.failed).toBe(0);
    expect(sim.wrong).toBe(0);
    expect(sim.outOfSync).toHaveLength(0);
  });
});

describe("the right order", () => {
  it("add column, trigger, copy, roll servers, drop: nothing wrong", () => {
    // reads only so the assertion on wrong is about the migration, not luck
    const sim = make(seq([0.9, 0.2, 0.5]));
    sim.setRate(6);
    sim.setTraffic(true);
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    expect(sim.columns.name).toBe(true);
    runOp(sim, "createTrigger", OP_SECS.createTrigger + 0.5);
    expect(sim.trigger).toBe(true);
    runOp(sim, "copy", COPY_ALL);
    expect(sim.outOfSync).toHaveLength(0);

    const [a, b] = sim.servers;
    for (const s of [a, b]) {
      sim.toggleDrain(s);
      run(sim, 1.5);
      sim.startUpgrade(s);
      run(sim, UPGRADE_SECS + 0.5);
      expect(s.version).toBe(2);
      sim.toggleDrain(s);
      run(sim, 1);
    }
    expect(sim.failed).toBe(0);
    expect(sim.wrong).toBe(0);

    runOp(sim, "dropTrigger", OP_SECS.dropTrigger + 0.5);
    runOp(sim, "dropColumns", OP_SECS.dropColumns + 0.5);
    expect(sim.done).toBe(true);
    expect(sim.failed).toBe(0);
    expect(sim.wrong).toBe(0);
    expect(sim.outOfSync).toHaveLength(0);
    expect(lastLog(sim)).toContain("goal reached");
    expect(lastLog(sim)).toContain("0 failed, 0 wrong, 0 rows out of sync");
  });

  it("writes through the trigger keep both column sets in sync", () => {
    // writes only
    const sim = make(seq([0.1, 0.2, 0.5, 0.3]));
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "createTrigger", OP_SECS.createTrigger + 0.5);
    runOp(sim, "copy", COPY_ALL);
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 4);
    expect(sim.handled).toBeGreaterThan(5);
    expect(sim.outOfSync).toHaveLength(0);
    expect(sim.rows.some(r => r.lastOp?.kind === "trigger")).toBe(true);
  });
});

describe("mistakes", () => {
  it("a v2 server before the column exists fails every request", () => {
    const sim = make();
    const c = sim.addServer(2);
    expect(c).not.toBeNull();
    expect(lastLog(sim)).toContain("missing columns: name");
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 4);
    expect(c?.failed).toBeGreaterThan(0);
    expect(c?.served).toBe(0);
    expect(sim.failed).toBeGreaterThan(0);
    expect(sim.log.some(l => l.msg.includes('column "name" does not exist'))).toBe(true);
  });

  it("copy without the trigger leaves later writes out of sync", () => {
    // writes only, always row 1
    const sim = make(seq([0.1, 0.0, 0.5, 0.3]));
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "copy", COPY_ALL);
    expect(sim.outOfSync).toHaveLength(0);
    sim.setRate(4);
    sim.setTraffic(true);
    run(sim, 3);
    const drifted = sim.outOfSync;
    expect(drifted.length).toBeGreaterThan(0);
    // v1 wrote the two columns; nothing carried it into name
    for (const row of drifted) {
      expect(joinName(row.firstName, row.lastName)).toBe(row.truth);
      expect(row.name).not.toBe(row.truth);
    }
  });

  it("a second copy after the trigger repairs drifted rows", () => {
    const sim = make(seq([0.1, 0.0, 0.5, 0.3]));
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "copy", COPY_ALL);
    sim.setRate(4);
    sim.setTraffic(true);
    run(sim, 3);
    sim.setTraffic(false);
    expect(sim.outOfSync.length).toBeGreaterThan(0);
    runOp(sim, "createTrigger", OP_SECS.createTrigger + 0.5);
    expect(sim.log.some(l => l.msg.includes("already out of sync"))).toBe(true);
    runOp(sim, "copy", COPY_ALL);
    expect(sim.outOfSync).toHaveLength(0);
  });

  it("v2 reads before the copy return null names, which count as wrong", () => {
    const sim = make(seq([0.9, 0.2, 0.5]));
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    const c = sim.addServer(2);
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 4);
    expect(c?.wrong).toBeGreaterThan(0);
    expect(sim.wrong).toBeGreaterThan(0);
    expect(sim.failed).toBe(0);
  });

  it("dropping the columns with v1 still in the pool fails their requests", () => {
    const sim = make(seq([0.9, 0.2, 0.5]));
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "copy", COPY_ALL);
    runOp(sim, "dropColumns", OP_SECS.dropColumns + 0.5);
    expect(sim.columns.firstName).toBe(false);
    expect(lastLog(sim)).toContain("app v1 failing");
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 3);
    expect(sim.failed).toBeGreaterThan(0);
    expect(sim.handled).toBe(0);
  });

  it("the columns cannot be dropped while the trigger depends on them", () => {
    const sim = make();
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "createTrigger", OP_SECS.createTrigger + 0.5);
    expect(sim.opBlocked("dropColumns")).toContain("depends on column first_name");
    expect(sim.runOp("dropColumns")).toBe(false);
    expect(sim.columns.firstName).toBe(true);
    expect(sim.log[0].level).toBe("bad");
  });

  it("the trigger needs both column sets", () => {
    const sim = make();
    expect(sim.opBlocked("createTrigger")).toContain('"name"');
    expect(sim.runOp("createTrigger")).toBe(false);
  });

  it("only one database operation runs at a time", () => {
    const sim = make();
    expect(sim.runOp("addColumn")).toBe(true);
    expect(sim.opBlocked("copy")).toBe("Another operation is running");
    expect(sim.runOp("copy")).toBe(false);
  });

  it("dropping the columns freezes out-of-sync rows as wrong for good", () => {
    const sim = make(seq([0.1, 0.0, 0.5, 0.3]));
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "copy", COPY_ALL);
    sim.setRate(4);
    sim.setTraffic(true);
    run(sim, 3);
    sim.setTraffic(false);
    const stuck = sim.outOfSync.length;
    expect(stuck).toBeGreaterThan(0);
    for (const s of sim.servers) {
      sim.startUpgrade(s);
    }
    run(sim, UPGRADE_SECS + 0.5);
    runOp(sim, "dropColumns", OP_SECS.dropColumns + 0.5);
    expect(sim.done).toBe(true);
    expect(sim.outOfSync).toHaveLength(stuck);
    expect(lastLog(sim)).toContain(`${stuck} rows out of sync`);
    expect(sim.log.some(l => l.msg.includes(`${stuck} rows stale`))).toBe(true);
  });

  it("stale first_name and last_name after everyone is on v2 are harmless", () => {
    // writes only
    const sim = make(seq([0.1, 0.2, 0.5, 0.3]));
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "createTrigger", OP_SECS.createTrigger + 0.5);
    runOp(sim, "copy", COPY_ALL);
    for (const s of sim.servers) sim.startUpgrade(s);
    run(sim, UPGRADE_SECS + HEALTH_SECS + 0.5);
    runOp(sim, "dropTrigger", OP_SECS.dropTrigger + 0.5);
    expect(lastLog(sim)).toBe("DROP TRIGGER users_name_sync");
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 3);
    sim.setTraffic(false);
    expect(sim.staleSplit.length).toBeGreaterThan(0);
    expect(sim.staleName).toHaveLength(0);
    // nothing on v1 reads first_name and last_name, so this is not out of sync
    expect(sim.outOfSync).toHaveLength(0);
    // until something on v1 shows up to read them
    const v1 = sim.addServer(1);
    expect(sim.outOfSync.length).toBe(sim.staleSplit.length);
    if (v1) sim.removeServer(v1);
    expect(sim.outOfSync).toHaveLength(0);
    runOp(sim, "dropColumns", OP_SECS.dropColumns + 0.5);
    expect(sim.done).toBe(true);
    expect(sim.outOfSync).toHaveLength(0);
    expect(
      sim.log.some(l => l.msg === "ALTER TABLE. first_name, last_name dropped")
    ).toBe(true);
  });

  it("upgrading a server still in the pool fails requests sent to it", () => {
    const sim = make();
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "copy", COPY_ALL);
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 2);
    const [a] = sim.servers;
    sim.startUpgrade(a);
    expect(lastLog(sim)).toContain("still in pool");
    run(sim, HEALTH_SECS + 1);
    expect(a.failed).toBeGreaterThan(0);
    expect(a.lbHealthy).toBe(false);
    // once out of rotation web-02 takes everything
    const failedSoFar = sim.failed;
    run(sim, 1.5);
    expect(sim.failed).toBe(failedSoFar);
  });

  it("removing every server leaves the balancer with nowhere to go", () => {
    const sim = make();
    const [, b] = sim.servers;
    expect(sim.removeServer(b)).toBe(true);
    const [a] = sim.servers;
    expect(sim.canRemoveServer(a)).toBe(false);
    sim.toggleDrain(a);
    sim.setTraffic(true);
    run(sim, 2);
    expect(sim.failed).toBeGreaterThan(0);
    expect(sim.log.some(l => l.msg.includes("no backend available"))).toBe(true);
  });
});

describe("one-word names", () => {
  it("a v2 write of a mononym round-trips through the trigger without going stale", () => {
    // writes only; pickName draws 0.0 which is "Madonna"
    const sim = make(seq([0.1, 0.2, 0.5, 0.0]));
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "createTrigger", OP_SECS.createTrigger + 0.5);
    runOp(sim, "copy", COPY_ALL);
    const c = sim.addServer(2);
    expect(c).not.toBeNull();
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 4);
    const madonna = sim.rows.find(r => r.truth === "Madonna");
    expect(madonna).toBeDefined();
    if (!madonna) return;
    expect(madonna.name).toBe("Madonna");
    expect(madonna.firstName).toBe("Madonna");
    expect(madonna.lastName).toBe("");
    expect(sim.outOfSync).toHaveLength(0);
  });
});

describe("servers", () => {
  it("caps at four and numbers keep counting", () => {
    const sim = make();
    sim.addServer(2);
    sim.addServer(2);
    expect(sim.addServer(2)).toBeNull();
    expect(sim.servers).toHaveLength(MAX_SERVERS);
    const [, b] = sim.servers;
    sim.removeServer(b);
    expect(sim.addServer(2)?.name).toBe("web-05");
  });

  it("only v1 servers that are online can be upgraded", () => {
    const sim = make();
    const [a] = sim.servers;
    expect(sim.canUpgrade(a)).toBe(true);
    sim.startUpgrade(a);
    expect(sim.canUpgrade(a)).toBe(false);
    run(sim, UPGRADE_SECS + 0.5);
    expect(a.version).toBe(2);
    expect(sim.canUpgrade(a)).toBe(false);
  });

  it("the goal is not met while a v1 server remains, even drained", () => {
    const sim = make();
    runOp(sim, "addColumn", OP_SECS.addColumn + 0.5);
    runOp(sim, "copy", COPY_ALL);
    const [a, b] = sim.servers;
    sim.toggleDrain(b);
    sim.startUpgrade(a);
    run(sim, UPGRADE_SECS + 0.5);
    runOp(sim, "dropColumns", OP_SECS.dropColumns + 0.5);
    expect(sim.done).toBe(false);
    sim.removeServer(b);
    expect(sim.done).toBe(true);
  });

  it("restart resets everything", () => {
    const sim = make();
    sim.setTraffic(true);
    run(sim, 2);
    sim.runOp("addColumn");
    sim.restart();
    expect(sim.t).toBe(0);
    expect(sim.op).toBeNull();
    expect(sim.columns.name).toBe(false);
    expect(sim.servers).toHaveLength(2);
    expect(sim.handled).toBe(0);
    expect(
      sim.rows.every(
        r => r.name === null && joinName(r.firstName, r.lastName) === r.truth
      )
    ).toBe(true);
  });
});

// keep the type import used so eslint is happy about Server in the helper below
export function isServer(s: Server): boolean {
  return typeof s.name === "string";
}
