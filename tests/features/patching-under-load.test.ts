import { describe, expect, it } from "vitest";
import {
  HEALTH_SECS,
  HISTORY_SECS,
  MAX_RATE,
  MAX_SERVERS,
  PATCH_SECS,
  Sim,
  WORKERS,
  fmtClock,
  type Level,
} from "@/features/patching-under-load/sim";

const TICK = 1 / 60;

// deterministic jitter so the tests never depend on Math.random
const fixed = () => 0.5;

function make(level: Level): Sim {
  return new Sim({ level, random: fixed });
}

function run(sim: Sim, seconds: number): void {
  const steps = Math.round(seconds / TICK);
  for (let i = 0; i < steps; i++) sim.step(TICK);
}

function lastLog(sim: Sim): string {
  return sim.log[0]?.msg ?? "";
}

describe("fmtClock", () => {
  it("formats seconds as mm:ss", () => {
    expect(fmtClock(0)).toBe("00:00");
    expect(fmtClock(65.9)).toBe("01:05");
  });
});

describe("level 1: single server", () => {
  it("starts with one online server and a started log line", () => {
    const sim = make(1);
    expect(sim.servers).toHaveLength(1);
    expect(sim.servers[0].name).toBe("web-01");
    expect(sim.servers[0].online).toBe(true);
    expect(sim.done).toBe(false);
    expect(lastLog(sim)).toContain("Level 1 started");
  });

  it("serves everything at a modest rate", () => {
    const sim = make(1);
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 5);
    expect(sim.handled).toBeGreaterThan(15);
    expect(sim.dropped).toBe(0);
    expect(sim.availability).toBe(1);
  });

  it("does nothing while traffic is off", () => {
    const sim = make(1);
    run(sim, 3);
    expect(sim.handled).toBe(0);
    expect(sim.dropped).toBe(0);
    expect(sim.requests).toHaveLength(0);
  });

  it("clamps the rate to what three servers could serve", () => {
    const sim = make(1);
    sim.setRate(1000);
    expect(sim.rate).toBe(MAX_RATE);
    expect(MAX_RATE).toBe(24);
    sim.setRate(0);
    expect(sim.rate).toBe(1);
  });

  it("drops requests and counts downtime while patching under load", () => {
    const sim = make(1);
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 3);
    sim.startPatch(sim.servers[0]);
    expect(sim.servers[0].online).toBe(false);
    run(sim, PATCH_SECS / 2);
    expect(sim.dropped).toBeGreaterThan(0);
    expect(sim.downtime).toBeGreaterThan(PATCH_SECS / 2 - 0.1);
    expect(sim.availability).toBeLessThan(1);
  });

  it("reaches the goal when the first patch lands, and freezes", () => {
    const sim = make(1);
    sim.setRate(6);
    sim.setTraffic(true);
    sim.startPatch(sim.servers[0]);
    run(sim, PATCH_SECS - 0.5);
    expect(sim.done).toBe(false);
    run(sim, 1);
    expect(sim.servers[0].online).toBe(true);
    expect(sim.servers[0].patch).toBe(1);
    expect(sim.done).toBe(true);
    expect(sim.traffic).toBe(false);
    expect(sim.requests).toHaveLength(0);
    expect(lastLog(sim)).toMatch(/^Goal reached at 00:0[89]\. \d+ requests dropped/);
    const frozenAt = sim.t;
    const dropped = sim.dropped;
    run(sim, 5);
    expect(sim.t).toBe(frozenAt);
    expect(sim.dropped).toBe(dropped);
    // controls are inert once done
    sim.setTraffic(true);
    expect(sim.traffic).toBe(false);
    sim.startPatch(sim.servers[0]);
    expect(sim.servers[0].online).toBe(true);
  });

  it("patching with no traffic reaches the goal but says there were no users", () => {
    const sim = make(1);
    sim.startPatch(sim.servers[0]);
    run(sim, PATCH_SECS + 0.5);
    expect(sim.done).toBe(true);
    expect(sim.quiet).toBe(true);
    expect(sim.downtime).toBeGreaterThan(0);
    expect(lastLog(sim)).toContain("there were no users");
  });

  it("is not quiet once a single request has been sent", () => {
    const sim = make(1);
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 2);
    sim.setTraffic(false);
    sim.startPatch(sim.servers[0]);
    run(sim, PATCH_SECS + 0.5);
    expect(sim.done).toBe(true);
    expect(sim.quiet).toBe(false);
    expect(lastLog(sim)).not.toContain("there were no users");
  });

  it("cuts in-flight requests when a patch starts", () => {
    const sim = make(1);
    sim.setRate(6);
    sim.setTraffic(true);
    // requests take 1.1 s to land, then occupy a worker for 0.5 s
    run(sim, 2);
    expect(sim.dropped).toBe(0);
    const busy = sim.servers[0].jobs.length;
    expect(busy).toBeGreaterThan(0);
    const handledBefore = sim.handled;
    sim.startPatch(sim.servers[0]);
    expect(sim.dropped).toBe(busy);
    expect(sim.handled).toBe(handledBefore - busy);
    expect(lastLog(sim)).toContain(`${busy} in-flight requests cut`);
  });

  it("drops when every worker is busy and says so once per change", () => {
    const sim = make(1);
    // capacity is WORKERS / SERVICE_SECS = 8 per second
    sim.setRate(20);
    sim.setTraffic(true);
    run(sim, 4);
    expect(sim.dropped).toBeGreaterThan(0);
    expect(sim.servers[0].online).toBe(true);
    const warnings = () =>
      sim.log.filter(l => l.msg.includes("All workers on web-01 are busy"));
    expect(warnings()).toHaveLength(1);
    sim.setRate(24);
    run(sim, 4);
    expect(warnings()).toHaveLength(2);
  });

  it("ignores a patch on a server that is already patching", () => {
    const sim = make(1);
    sim.startPatch(sim.servers[0]);
    const logLength = sim.log.length;
    sim.startPatch(sim.servers[0]);
    expect(sim.log).toHaveLength(logLength);
  });

  it("cannot install a load balancer", () => {
    const sim = make(1);
    expect(sim.installLB()).toBe(false);
    expect(sim.lb).toBe(false);
  });

  it("records one history bucket per second, capped", () => {
    const sim = make(1);
    run(sim, 5.5);
    expect(sim.history).toHaveLength(5);
    run(sim, HISTORY_SECS + 5);
    expect(sim.history).toHaveLength(HISTORY_SECS);
  });

  it("restart clears everything back to the starting state", () => {
    const sim = make(1);
    sim.setTraffic(true);
    sim.startPatch(sim.servers[0]);
    run(sim, PATCH_SECS + 1);
    expect(sim.done).toBe(true);
    sim.restart();
    expect(sim.t).toBe(0);
    expect(sim.done).toBe(false);
    expect(sim.traffic).toBe(false);
    expect(sim.handled).toBe(0);
    expect(sim.dropped).toBe(0);
    expect(sim.downtime).toBe(0);
    expect(sim.servers).toHaveLength(1);
    expect(sim.servers[0].online).toBe(true);
    expect(sim.servers[0].patch).toBe(0);
    expect(sim.history).toHaveLength(0);
    expect(sim.takeEvents()).toHaveLength(0);
  });

  it("hands events over once", () => {
    const sim = make(1);
    sim.setRate(10);
    sim.setTraffic(true);
    run(sim, 1);
    const events = sim.takeEvents();
    expect(events.some(e => e.type === "sent")).toBe(true);
    expect(sim.takeEvents()).toHaveLength(0);
  });
});

describe("level 2: load balancer", () => {
  it("extra servers get no traffic without a balancer", () => {
    const sim = make(2);
    const second = sim.addServer();
    expect(second?.name).toBe("web-02");
    expect(lastLog(sim)).toContain("the users only know the address of web-01");
    sim.setTraffic(true);
    run(sim, 4);
    expect(sim.servers[0].served).toBeGreaterThan(0);
    expect(sim.servers[1].served).toBe(0);
  });

  it("removes a server, but never the last one or web-01 without a balancer", () => {
    const sim = make(2);
    const [a] = sim.servers;
    expect(sim.canRemoveServer(a)).toBe(false);
    const b = sim.addServer();
    expect(b).not.toBeNull();
    if (!b) return;
    expect(sim.canRemoveServer(a)).toBe(false);
    expect(sim.canRemoveServer(b)).toBe(true);
    sim.installLB();
    expect(sim.canRemoveServer(a)).toBe(true);
    expect(sim.removeServer(a)).toBe(true);
    expect(sim.servers).toEqual([b]);
    expect(sim.canRemoveServer(b)).toBe(false);
    expect(lastLog(sim)).toContain("web-01 removed");
  });

  it("removing a server with requests in flight drops them", () => {
    const sim = make(2);
    const b = sim.addServer();
    sim.installLB();
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 3);
    if (!b) return;
    expect(sim.inflight(b)).toBeGreaterThan(0);
    expect(sim.dropped).toBe(0);
    sim.removeServer(b);
    expect(sim.dropped).toBeGreaterThan(0);
    expect(sim.requests.some(r => r.server === b)).toBe(false);
    expect(lastLog(sim)).toContain("in-flight requests lost");
  });

  it("caps the number of servers", () => {
    const sim = make(2);
    for (let i = 0; i < 10; i++) sim.addServer();
    expect(sim.servers).toHaveLength(MAX_SERVERS);
    expect(sim.canAddServer).toBe(false);
  });

  it("spreads traffic across the pool once the balancer is in", () => {
    const sim = make(2);
    sim.addServer();
    expect(sim.installLB()).toBe(true);
    expect(sim.installLB()).toBe(false);
    sim.setRate(10);
    sim.setTraffic(true);
    run(sim, 4);
    expect(sim.servers[0].served).toBeGreaterThan(0);
    expect(sim.servers[1].served).toBeGreaterThan(0);
    expect(sim.dropped).toBe(0);
  });

  it("drain, patch, return: nothing dropped", () => {
    const sim = make(2);
    sim.addServer();
    sim.installLB();
    sim.setRate(4);
    sim.setTraffic(true);
    run(sim, 3);
    const [a, b] = sim.servers;
    sim.toggleDrain(a);
    expect(a.inPool).toBe(false);
    // let in-flight requests to web-01 land and finish
    run(sim, 2);
    expect(sim.inflight(a)).toBe(0);
    const servedByB = b.served;
    sim.startPatch(a);
    expect(lastLog(sim)).toContain("Drained first, so nobody notices");
    run(sim, PATCH_SECS + 1);
    expect(a.online).toBe(true);
    expect(a.patch).toBe(1);
    expect(b.served).toBeGreaterThan(servedByB);
    expect(sim.dropped).toBe(0);
    expect(sim.downtime).toBe(0);
    sim.toggleDrain(a);
    expect(a.inPool).toBe(true);
    expect(a.lbHealthy).toBe(true);
    run(sim, 2);
    expect(sim.dropped).toBe(0);
  });

  it("ends when three servers reach v1.0.1", () => {
    const sim = make(2);
    sim.addServer();
    sim.addServer();
    sim.installLB();
    sim.setRate(4);
    sim.setTraffic(true);
    const [a, b, c] = sim.servers;
    // the careful procedure, once per server
    for (const s of [a, b, c]) {
      sim.toggleDrain(s);
      run(sim, 2);
      sim.startPatch(s);
      run(sim, PATCH_SECS + 0.5);
      if (!sim.done) sim.toggleDrain(s);
      run(sim, 1);
    }
    expect([a.patch, b.patch, c.patch]).toEqual([1, 1, 1]);
    expect(sim.patchedCount).toBe(3);
    expect(sim.done).toBe(true);
    expect(sim.traffic).toBe(false);
    expect(sim.dropped).toBe(0);
    expect(lastLog(sim)).toContain("Goal reached");
    expect(lastLog(sim)).toContain("Not one request dropped");
  });

  it("a patched server does not count until it is returned to the pool", () => {
    const sim = make(2);
    sim.addServer();
    sim.addServer();
    sim.installLB();
    const [a, b, c] = sim.servers;
    sim.startPatch(a);
    sim.startPatch(b);
    run(sim, PATCH_SECS + 0.5);
    expect(sim.patchedCount).toBe(2);
    sim.toggleDrain(c);
    run(sim, 1);
    sim.startPatch(c);
    run(sim, PATCH_SECS + 0.5);
    expect(c.patch).toBe(1);
    expect(c.online).toBe(true);
    expect(sim.patchedCount).toBe(2);
    expect(sim.done).toBe(false);
    sim.toggleDrain(c);
    expect(sim.patchedCount).toBe(3);
    expect(sim.done).toBe(true);
  });

  it("a server at the goal version cannot be patched again", () => {
    const sim = make(2);
    sim.addServer();
    const [a] = sim.servers;
    sim.startPatch(a);
    run(sim, PATCH_SECS + 0.5);
    expect(a.patch).toBe(1);
    expect(sim.upToDate(a)).toBe(true);
    const logLength = sim.log.length;
    sim.startPatch(a);
    expect(a.online).toBe(true);
    expect(sim.log).toHaveLength(logLength);
  });

  it("two servers at v1.0.1 is not enough", () => {
    const sim = make(2);
    sim.addServer();
    const [a, b] = sim.servers;
    sim.startPatch(a);
    sim.startPatch(b);
    run(sim, PATCH_SECS + 0.5);
    expect(a.patch).toBe(1);
    expect(b.patch).toBe(1);
    expect(sim.patchedCount).toBe(2);
    expect(sim.done).toBe(false);
  });

  it("patching a server still in the pool drops until the health check catches it", () => {
    const sim = make(2);
    sim.addServer();
    sim.installLB();
    sim.setRate(4);
    sim.setTraffic(true);
    run(sim, 3);
    const [a] = sim.servers;
    sim.startPatch(a);
    expect(lastLog(sim)).toContain("keeps sending it traffic until a health check fails");
    run(sim, HEALTH_SECS + 1);
    expect(sim.dropped).toBeGreaterThan(0);
    expect(a.lbHealthy).toBe(false);
    expect(sim.log.some(l => l.msg.includes("Health check failed for web-01"))).toBe(true);
    // once out of rotation, web-02 takes everything and drops stop
    const droppedSoFar = sim.dropped;
    run(sim, 2);
    expect(sim.dropped).toBe(droppedSoFar);
    expect(sim.downtime).toBe(0);
  });

  it("marks downtime when the only pooled server is patching", () => {
    const sim = make(2);
    sim.installLB();
    sim.setRate(6);
    sim.setTraffic(true);
    run(sim, 2);
    sim.startPatch(sim.servers[0]);
    run(sim, HEALTH_SECS + 2);
    expect(sim.reachable).toBe(false);
    expect(sim.downtime).toBeGreaterThan(0);
    expect(sim.log.some(l => l.msg.includes("no healthy server in the pool"))).toBe(true);
  });

  it("brings a patched server back into rotation after a passing health check", () => {
    const sim = make(2);
    sim.addServer();
    sim.installLB();
    const [a] = sim.servers;
    sim.startPatch(a);
    run(sim, HEALTH_SECS + 0.5);
    expect(a.lbHealthy).toBe(false);
    run(sim, PATCH_SECS);
    expect(a.online).toBe(true);
    expect(a.lbHealthy).toBe(true);
    expect(sim.log.some(l => l.msg.includes("Health check passed for web-01"))).toBe(true);
  });

  it("never sends more than WORKERS concurrent jobs to one server", () => {
    const sim = make(2);
    sim.addServer();
    sim.installLB();
    sim.setRate(MAX_RATE);
    sim.setTraffic(true);
    for (let i = 0; i < 300; i++) {
      sim.step(TICK);
      for (const s of sim.servers) expect(s.jobs.length).toBeLessThanOrEqual(WORKERS);
    }
  });
});
