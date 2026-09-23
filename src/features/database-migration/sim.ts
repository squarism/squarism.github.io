// schema migration under traffic: the simulation, with no dom in it. the vue
// component renders it; tests/features drives it with fake time.
//
// the users table has first_name and last_name. app v2 wants one name
// column, because splitting names was a bad idea. traffic keeps reading and
// writing the whole time. every operation is always available and nothing
// enforces an order: the wrong order shows up as failed requests, wrong data,
// or rows that no longer agree with what was last written. there is no
// capacity model here, it is not about load.

export const MAX_SERVERS = 4;
export const MAX_RATE = 12;
export const UPGRADE_SECS = 5;
export const HEALTH_SECS = 2;
export const HISTORY_SECS = 60;
export const WRITE_SHARE = 0.3;

// how long each database operation takes. the copy script is per row.
export const OP_SECS = {
  addColumn: 1.5,
  copyRow: 0.8,
  createTrigger: 1.5,
  dropTrigger: 1,
  dropColumns: 2,
} as const;

export type AppVersion = 1 | 2;

export interface Server {
  name: string;
  version: AppVersion;
  online: boolean;
  upgradeLeft: number;
  inPool: boolean;
  // what lb-01 believes, refreshed by the health check
  lbHealthy: boolean;
  served: number;
  failed: number;
  wrong: number;
}

export interface Row {
  id: number;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  // what was last written to this row, through either column set
  truth: string;
  // the most recent thing that touched the row, for the table's markers
  lastOp: { kind: RowOpKind; at: number } | null;
}

export type RowOpKind =
  | "read"
  | "write"
  | "trigger"
  | "copy"
  | "wrong"
  | "failed";

export interface Columns {
  name: boolean;
  firstName: boolean;
  lastName: boolean;
}

export type OpId =
  | "addColumn"
  | "copy"
  | "createTrigger"
  | "dropTrigger"
  | "dropColumns";

export interface OpSpec {
  id: OpId;
  label: string;
  sql: string;
}

export const OPS: OpSpec[] = [
  {
    id: "addColumn",
    label: "Add the new column",
    sql: "alter table users\n  add column name text;",
  },
  {
    id: "createTrigger",
    label: "Create the sync trigger",
    sql: "create trigger users_name_sync\n  before insert or update on users\n  for each row execute function sync_name();",
  },
  {
    id: "copy",
    label: "Run the copy script",
    sql: "-- one row at a time, each row once\nupdate users\n  set name = first_name || ' ' || last_name\n  where id = $1;",
  },
  {
    id: "dropTrigger",
    label: "Drop the sync trigger",
    sql: "drop trigger users_name_sync on users;",
  },
  {
    id: "dropColumns",
    label: "Drop the old columns",
    sql: "alter table users\n  drop column first_name,\n  drop column last_name;",
  },
];

// what each app version runs. the component colours the column names by
// whether they exist right now.
export const APP_QUERIES: Record<
  AppVersion,
  { read: string; write: string; columns: (keyof Columns)[] }
> = {
  1: {
    read: "select id, first_name, last_name from users where id = $1",
    write: "update users set first_name = $1, last_name = $2 where id = $3",
    columns: ["firstName", "lastName"],
  },
  2: {
    read: "select id, name from users where id = $1",
    write: "update users set name = $1 where id = $2",
    columns: ["name"],
  },
};

export interface Request {
  kind: "read" | "write";
  rowId: number;
  server: Server;
  p: number;
  dur: number;
  jitter: number;
}

export interface Bucket {
  ok: number;
  wrong: number;
  failed: number;
  off: boolean;
}

export interface LogEntry {
  t: number;
  msg: string;
  level: "info" | "warn" | "bad";
}

export type SimEvent =
  | { type: "sent"; request: Request }
  | { type: "served"; request: Request; wrong: boolean }
  | { type: "failed"; request: Request | null; server: Server | null };

export interface RunningOp {
  id: OpId;
  left: number;
  total: number;
  // copy script only: the row it is on
  cursor: number;
}

export interface SimOptions {
  random?: () => number;
  rows?: number;
}

export const TITLE = "Online data migration";
export const INTRO =
  "Fix the database while the site is live.  Click Start traffic to begin.";
export const GOAL_TEXT = "Get every server on app v2 and the data migrated.";

const SEED_NAMES = [
  "Ada Lovelace",
  "Grace Hopper",
  "Linus Torvalds",
  "Alan Turing",
  "Edsger Dijkstra",
  "Barbara Liskov",
  "Ken Thompson",
  "Margaret Hamilton",
  "Dennis Ritchie",
  "Radia Perlman",
  "Frances Allen",
  "Donald Knuth",
];

// what a write changes a name to. a few of these are one word, which is the
// whole reason first_name and last_name was a bad idea
const NEW_NAMES = [
  "Madonna",
  "Prince",
  "Cher",
  "Ada King",
  "Grace Murray",
  "Linus Benedict",
  "Alan Mathison",
  "Edsger Wybe",
  "Barbara Huberman",
  "Ken Lee",
  "Margaret Heafield",
  "Dennis MacAlistair",
  "Radia Joy",
  "Frances Elizabeth",
  "Donald Ervin",
];

export function fmtClock(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function splitName(name: string): [string, string] {
  const i = name.indexOf(" ");
  return i === -1 ? [name, ""] : [name.slice(0, i), name.slice(i + 1)];
}

export function joinName(
  first: string | null,
  last: string | null
): string | null {
  if (first === null || last === null) return null;
  return `${first} ${last}`.trim();
}

export class Sim {
  private readonly random: () => number;
  private readonly rowCount: number;

  t = 0;
  traffic = false;
  rate = 4;
  handled = 0;
  wrong = 0;
  failed = 0;
  servers: Server[] = [];
  rows: Row[] = [];
  columns: Columns = { name: false, firstName: true, lastName: true };
  trigger = false;
  op: RunningOp | null = null;
  requests: Request[] = [];
  history: Bucket[] = [];
  log: LogEntry[] = [];
  done = false;

  private acc = 0;
  private nextServer = 1;
  private rr = 0;
  private bucket: Bucket = { ok: 0, wrong: 0, failed: 0, off: false };
  private nextSec = 1;
  private events: SimEvent[] = [];
  private warnedEmpty = false;
  private healthTimer = HEALTH_SECS;

  constructor({
    random = Math.random,
    rows = SEED_NAMES.length,
  }: SimOptions = {}) {
    this.random = random;
    this.rowCount = Math.min(rows, SEED_NAMES.length);
    this.restart();
  }

  restart(): void {
    this.t = 0;
    this.traffic = false;
    this.handled = 0;
    this.wrong = 0;
    this.failed = 0;
    this.servers = [];
    this.rows = SEED_NAMES.slice(0, this.rowCount).map((name, i) => {
      const [firstName, lastName] = splitName(name);
      return {
        id: i + 1,
        name: null,
        firstName,
        lastName,
        truth: name,
        lastOp: null,
      };
    });
    this.columns = { name: false, firstName: true, lastName: true };
    this.trigger = false;
    this.op = null;
    this.requests = [];
    this.history = [];
    this.log = [];
    this.done = false;
    this.acc = 0;
    this.nextServer = 1;
    this.rr = 0;
    this.bucket = { ok: 0, wrong: 0, failed: 0, off: false };
    this.nextSec = 1;
    this.events = [];
    this.warnedEmpty = false;
    this.healthTimer = HEALTH_SECS;
    this.addServer(1);
    this.addServer(1);
    this.say(`lb-01 up. web-01 web-02 app v1. users: ${this.rows.length} rows`);
  }

  takeEvents(): SimEvent[] {
    const out = this.events;
    this.events = [];
    return out;
  }

  /* ---------- traffic ---------- */

  setTraffic(on: boolean): void {
    if (this.traffic === on || this.done) return;
    this.traffic = on;
    this.say(on ? `traffic on, ${this.rate} req/s` : "traffic off");
  }

  setRate(rate: number): void {
    this.rate = Math.max(1, Math.min(MAX_RATE, rate));
  }

  /* ---------- servers ---------- */

  get canAddServer(): boolean {
    return this.servers.length < MAX_SERVERS && !this.done;
  }

  addServer(version: AppVersion): Server | null {
    if (!this.canAddServer) return null;
    const n = this.nextServer++;
    const server: Server = {
      name: `web-0${n}`,
      version,
      online: true,
      upgradeLeft: 0,
      inPool: true,
      lbHealthy: true,
      served: 0,
      failed: 0,
      wrong: 0,
    };
    this.servers.push(server);
    if (this.log.length) {
      const missing = this.missingColumns(version);
      this.say(
        `${server.name} app v${version} joined pool` +
          (missing.length ? `. missing columns: ${missing.join(", ")}` : ""),
        missing.length ? "warn" : "info"
      );
    }
    return server;
  }

  canRemoveServer(server: Server): boolean {
    return (
      !this.done && this.servers.length > 1 && this.servers.includes(server)
    );
  }

  removeServer(server: Server): boolean {
    if (!this.canRemoveServer(server)) return false;
    const cut = this.requests.filter(r => r.server === server).length;
    this.requests = this.requests.filter(r => r.server !== server);
    this.servers = this.servers.filter(s => s !== server);
    if (cut) {
      this.fail(cut);
      this.events.push({ type: "failed", request: null, server });
    }
    this.say(
      `${server.name} removed${cut ? `, ${cut} requests lost` : ""}`,
      cut ? "bad" : "info"
    );
    this.checkGoal();
    return true;
  }

  toggleDrain(server: Server): void {
    if (this.done) return;
    server.inPool = !server.inPool;
    if (server.inPool) server.lbHealthy = server.online;
    this.say(
      server.inPool ? `${server.name} in pool` : `${server.name} draining`
    );
    this.checkGoal();
  }

  canUpgrade(server: Server): boolean {
    return !this.done && server.online && server.version === 1;
  }

  // in place: the server goes offline for UPGRADE_SECS and comes back on v2
  startUpgrade(server: Server): void {
    if (!this.canUpgrade(server)) return;
    server.online = false;
    server.upgradeLeft = UPGRADE_SECS;
    const cut = this.requests.filter(r => r.server === server).length;
    if (cut) {
      this.requests = this.requests.filter(r => r.server !== server);
      this.fail(cut);
      this.events.push({ type: "failed", request: null, server });
    }
    this.say(
      `${server.name} upgrading to app v2, offline` +
        (cut ? `, ${cut} requests cut` : "") +
        (server.inPool ? ", still in pool" : ""),
      cut || server.inPool ? "warn" : "info"
    );
  }

  private finishUpgrade(server: Server): void {
    server.online = true;
    server.version = 2;
    const missing = this.missingColumns(2);
    this.say(
      `${server.name} up, app v2` +
        (missing.length ? `. missing columns: ${missing.join(", ")}` : ""),
      missing.length ? "warn" : "info"
    );
    this.checkGoal();
  }

  eligible(server: Server): boolean {
    return server.inPool && server.lbHealthy;
  }

  private healthCheck(): void {
    for (const s of this.servers) {
      if (!s.inPool) continue;
      if (s.lbHealthy && !s.online) {
        s.lbHealthy = false;
        this.say(
          `lb-01: ${s.name} health check failed, out of rotation`,
          "warn"
        );
      } else if (!s.lbHealthy && s.online) {
        s.lbHealthy = true;
        this.say(`lb-01: ${s.name} health check ok, in rotation`);
      }
    }
  }

  get reachable(): boolean {
    return this.servers.some(s => s.online && this.eligible(s));
  }

  /* ---------- database ---------- */

  get busy(): boolean {
    return this.op !== null;
  }

  // the columns an app version needs that the table does not have
  missingColumns(version: AppVersion): string[] {
    return APP_QUERIES[version].columns
      .filter(c => !this.columns[c])
      .map(c =>
        c === "firstName"
          ? "first_name"
          : c === "lastName"
            ? "last_name"
            : "name"
      );
  }

  // whether an op can start right now, and why not if it cannot
  opBlocked(id: OpId): string | null {
    if (this.done) return "The run is over";
    if (this.op) return "Another operation is running";
    switch (id) {
      case "addColumn":
        return this.columns.name ? 'column "name" already exists' : null;
      case "createTrigger":
        if (this.trigger) return "users_name_sync already exists";
        if (!this.columns.name) return 'column "name" does not exist';
        if (!this.columns.firstName)
          return 'column "first_name" does not exist';
        return null;
      case "copy":
        if (!this.columns.name) return 'column "name" does not exist';
        if (!this.columns.firstName)
          return 'column "first_name" does not exist';
        return null;
      case "dropTrigger":
        return this.trigger ? null : "users_name_sync does not exist";
      case "dropColumns":
        if (!this.columns.firstName)
          return 'column "first_name" does not exist';
        if (this.trigger)
          return "trigger users_name_sync depends on column first_name";
        return null;
    }
  }

  runOp(id: OpId): boolean {
    const blocked = this.opBlocked(id);
    if (blocked) {
      this.say(`ERROR: ${blocked}`, "bad");
      return false;
    }
    if (id === "copy") {
      this.op = {
        id,
        left: OP_SECS.copyRow,
        total: OP_SECS.copyRow,
        cursor: 0,
      };
      this.say("copy script started");
      return true;
    }
    const secs = OP_SECS[id];
    this.op = { id, left: secs, total: secs, cursor: -1 };
    this.say(`psql: ${OPS.find(o => o.id === id)?.sql.split("\n")[0] ?? id}`);
    return true;
  }

  private finishOp(op: RunningOp): void {
    switch (op.id) {
      case "addColumn":
        this.columns.name = true;
        this.say("ALTER TABLE. name added, null");
        break;
      case "createTrigger": {
        this.trigger = true;
        const drifted = this.outOfSync.length;
        this.say(
          "CREATE TRIGGER users_name_sync" +
            (drifted ? `. ${drifted} rows already out of sync` : ""),
          drifted ? "warn" : "info"
        );
        break;
      }
      case "dropTrigger": {
        this.trigger = false;
        const v1 = this.servers.some(s => s.version === 1);
        this.say(
          "DROP TRIGGER users_name_sync" +
            (v1 ? ". app v1 still writing first_name, last_name" : ""),
          v1 ? "warn" : "info"
        );
        break;
      }
      case "dropColumns": {
        this.columns.firstName = false;
        this.columns.lastName = false;
        for (const r of this.rows) {
          r.firstName = null;
          r.lastName = null;
        }
        const v1 = this.servers.filter(
          s => s.version === 1 && this.eligible(s)
        );
        const stuck = this.staleName.length;
        this.say(
          "ALTER TABLE. first_name, last_name dropped" +
            (v1.length
              ? `. ${v1.map(s => s.name).join(", ")} app v1 failing`
              : "") +
            (stuck ? `. ${stuck} rows stale` : ""),
          v1.length || stuck ? "bad" : "info"
        );
        break;
      }
      case "copy":
        break;
    }
    this.op = null;
    this.checkGoal();
  }

  private copyRow(row: Row): void {
    const joined = joinName(row.firstName, row.lastName);
    if (joined === null) return;
    row.name = joined;
    row.lastOp = { kind: "copy", at: this.t };
  }

  /* ---------- correctness ---------- */

  // a row is consistent when every column set the table has agrees with the
  // last value written to it
  consistent(row: Row): boolean {
    if (this.columns.name && row.name !== row.truth) return false;
    if (
      this.columns.firstName &&
      joinName(row.firstName, row.lastName) !== row.truth
    )
      return false;
    return true;
  }

  // rows that could serve wrong data. a stale name always counts: app v2
  // reads it, and it survives dropping the old columns. stale first_name and
  // last_name only count while a server on app v1 is around to read them.
  get outOfSync(): Row[] {
    const v1 = this.servers.some(s => s.version === 1);
    const bad = new Set(this.staleName);
    if (v1) for (const r of this.staleSplit) bad.add(r);
    return this.rows.filter(r => bad.has(r));
  }

  // rows whose first_name and last_name disagree with truth
  get staleSplit(): Row[] {
    if (!this.columns.firstName) return [];
    return this.rows.filter(r => joinName(r.firstName, r.lastName) !== r.truth);
  }

  // rows whose name disagrees with truth
  get staleName(): Row[] {
    if (!this.columns.name) return [];
    return this.rows.filter(r => r.name !== r.truth);
  }

  get availability(): number {
    const total = this.handled + this.failed;
    return total ? this.handled / total : 1;
  }

  // the goal: all v2, old columns gone, and someone still serving
  get goalMet(): boolean {
    return (
      !this.columns.firstName &&
      this.servers.length > 0 &&
      this.servers.every(s => s.version === 2 && s.online) &&
      this.reachable
    );
  }

  private checkGoal(): void {
    if (!this.done && this.goalMet) this.finish();
  }

  private finish(): void {
    this.done = true;
    this.traffic = false;
    this.requests = [];
    this.op = null;
    const stuck = this.outOfSync.length;
    const clean = !this.failed && !this.wrong && !stuck;
    this.say(
      `goal reached ${fmtClock(this.t)}. ${this.failed} failed, ${this.wrong} wrong, ${stuck} rows out of sync`,
      clean ? "info" : "warn"
    );
  }

  /* ---------- time ---------- */

  step(dt: number): void {
    if (this.done) return;
    this.t += dt;

    for (const s of this.servers) {
      if (!s.online) {
        s.upgradeLeft -= dt;
        if (s.upgradeLeft <= 0) this.finishUpgrade(s);
      }
    }

    if (this.op) this.tickOp(dt);

    this.healthTimer -= dt;
    if (this.healthTimer <= 0) {
      this.healthTimer = HEALTH_SECS;
      this.healthCheck();
    }

    const reachable = this.reachable;
    if (!reachable) this.bucket.off = true;

    if (this.traffic) {
      this.acc += this.rate * dt;
      while (this.acc >= 1) {
        this.acc -= 1;
        this.spawn();
      }
    }

    const live = this.requests;
    this.requests = [];
    for (const r of live) {
      r.p += dt / r.dur;
      if (r.p >= 1) this.arrive(r);
      else this.requests.push(r);
    }

    if (this.t >= this.nextSec) {
      this.nextSec++;
      this.history.push(this.bucket);
      if (this.history.length > HISTORY_SECS) this.history.shift();
      this.bucket = { ok: 0, wrong: 0, failed: 0, off: !reachable };
    }
  }

  private tickOp(dt: number): void {
    const op = this.op;
    if (!op) return;
    op.left -= dt;
    if (op.left > 0) return;
    if (op.id === "copy") {
      const row = this.rows[op.cursor];
      if (row) this.copyRow(row);
      op.cursor++;
      if (op.cursor >= this.rows.length) {
        const stuck = this.outOfSync.length;
        this.say(
          `copy script done, ${this.rows.length} rows` +
            (stuck ? `. ${stuck} rows written since pass` : ""),
          stuck ? "warn" : "info"
        );
        this.op = null;
        this.checkGoal();
      } else {
        op.left = OP_SECS.copyRow;
      }
      return;
    }
    this.finishOp(op);
  }

  private pick(): Server | null {
    const n = this.servers.length;
    for (let i = 0; i < n; i++) {
      const s = this.servers[(this.rr + i) % n];
      if (this.eligible(s)) {
        this.rr = (this.rr + i + 1) % n;
        return s;
      }
    }
    return null;
  }

  private spawn(): void {
    const kind: Request["kind"] =
      this.random() < WRITE_SHARE ? "write" : "read";
    const rowId = 1 + Math.floor(this.random() * this.rows.length);
    const server = this.pick();
    if (!server) {
      this.fail(1);
      this.bucketFailed();
      this.events.push({ type: "failed", request: null, server: null });
      if (!this.warnedEmpty) {
        this.warnedEmpty = true;
        this.say("lb-01: no backend available, 503", "bad");
      }
      return;
    }
    this.warnedEmpty = false;
    const request: Request = {
      kind,
      rowId,
      server,
      p: 0,
      dur: 0.9,
      jitter: this.random() - 0.5,
    };
    this.requests.push(request);
    this.events.push({ type: "sent", request });
  }

  private arrive(request: Request): void {
    const s = request.server;
    const row = this.rows[request.rowId - 1];
    if (!s.online || !this.servers.includes(s)) {
      this.serverFailed(s, request, row);
      return;
    }
    const missing = this.missingColumns(s.version);
    if (missing.length) {
      this.serverFailed(
        s,
        request,
        row,
        `column "${missing[0]}" does not exist`
      );
      return;
    }
    if (request.kind === "read") this.read(s, request, row);
    else this.write(s, request, row);
  }

  private read(s: Server, request: Request, row: Row): void {
    const got =
      s.version === 1 ? joinName(row.firstName, row.lastName) : row.name;
    const wrong = got !== row.truth;
    s.served++;
    this.handled++;
    if (wrong) {
      s.wrong++;
      this.wrong++;
      this.bucket.wrong++;
      row.lastOp = { kind: "wrong", at: this.t };
    } else {
      this.bucket.ok++;
      row.lastOp = { kind: "read", at: this.t };
    }
    this.events.push({ type: "served", request, wrong });
  }

  private write(s: Server, request: Request, row: Row): void {
    const fresh = this.pickName(row.truth);
    if (s.version === 1) {
      // v1 has two boxes in its form, so a one-word name gets an empty last_name
      const [first, last] = splitName(fresh);
      row.firstName = first;
      row.lastName = last;
      if (this.trigger && this.columns.name) {
        row.name = fresh;
        row.lastOp = { kind: "trigger", at: this.t };
      } else {
        row.lastOp = { kind: "write", at: this.t };
      }
    } else {
      row.name = fresh;
      if (this.trigger && this.columns.firstName) {
        const [first, last] = splitName(fresh);
        row.firstName = first;
        row.lastName = last;
        row.lastOp = { kind: "trigger", at: this.t };
      } else {
        row.lastOp = { kind: "write", at: this.t };
      }
    }
    row.truth = fresh;
    s.served++;
    this.handled++;
    this.bucket.ok++;
    this.events.push({ type: "served", request, wrong: false });
  }

  private serverFailed(
    s: Server,
    request: Request,
    row: Row,
    why?: string
  ): void {
    s.failed++;
    this.fail(1);
    this.bucketFailed();
    row.lastOp = { kind: "failed", at: this.t };
    this.events.push({ type: "failed", request, server: s });
    if (why && !s.wrong && s.failed === 1) {
      this.say(`${s.name} app v${s.version}: ERROR: ${why}`, "bad");
    }
  }

  private pickName(current: string): string {
    const choices = NEW_NAMES.filter(n => n !== current);
    return choices[Math.floor(this.random() * choices.length)];
  }

  private fail(n: number): void {
    this.failed += n;
  }

  private bucketFailed(): void {
    this.bucket.failed++;
  }

  private say(msg: string, level: LogEntry["level"] = "info"): void {
    this.log.unshift({ t: this.t, msg, level });
    if (this.log.length > 80) this.log.pop();
  }
}
