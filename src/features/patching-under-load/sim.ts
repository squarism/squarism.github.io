// patching under load: the simulation, with no dom in it. the vue component
// renders it; tests/features drives it with fake time. one instance per stage.
//
// level 1: one server, one patch button. patching takes the server offline
// and every request that lands meanwhile is dropped. goal: get the patch on.
// level 2: the same, plus parts: extra servers and a load balancer that round
// robins across the pool and health checks it. drain a server first and it
// patches without dropping anything. goal: three servers on v1.0.1.

export const PATCH_SECS = 8;
export const SERVICE_SECS = 0.5;
export const WORKERS = 4;
export const MAX_SERVERS = 4;
export const HEALTH_SECS = 2;
export const HISTORY_SECS = 60;
// the users box scales up to what three servers can serve: 3 * 4 / 0.5
export const MAX_RATE = (3 * WORKERS) / SERVICE_SECS;

export type Level = 1 | 2;

export interface Server {
  name: string;
  online: boolean;
  // patches applied so far; the version shown is v1.0.<patch>
  patch: number;
  patchLeft: number;
  // end times of in-flight requests, one per busy worker
  jobs: number[];
  served: number;
  inPool: boolean;
  lbHealthy: boolean;
}

// a request in flight. "lb" legs travel from the users to the balancer,
// "server" legs from the users (level 1) or the balancer (level 2) to a
// server. jitter is a fixed -0.5..0.5 so the renderer can spread landings.
export interface Request {
  leg: "lb" | "server";
  from: "users" | "lb";
  p: number;
  dur: number;
  server: Server | null;
  jitter: number;
}

// one second of history for the strip: served, dropped, and whether nothing
// was able to serve at any point in that second
export interface Bucket {
  h: number;
  d: number;
  off: boolean;
}

export interface LogEntry {
  t: number;
  msg: string;
}

export type SimEvent =
  | { type: "sent" }
  | { type: "served"; request: Request }
  | { type: "dropped"; request: Request };

export interface Goal {
  // how many servers need to reach the patch level
  servers: number;
  patches: number;
  text: string;
}

export interface SimOptions {
  level: Level;
  random?: () => number;
}

export const LEVELS: Record<
  Level,
  { title: string; intro: string; goal: Goal }
> = {
  1: {
    title: "Single server under load",
    intro:
      "Start the traffic, then patch the server. Patching takes it offline, and every request will be dropped.  Even though the goal is not possible in this scenario, try anyway.",
    goal: {
      servers: 1,
      patches: 1,
      text: "Try to get web-01 onto v1.0.1",
    },
  },
  2: {
    title: "Patching behind a load balancer",
    intro:
      "Same server, same patches. This time you have parts: add servers, put a load balancer in front of them, then drain one server at a time and patch it.",
    goal: {
      servers: 3,
      patches: 1,
      text: "Get three servers onto v1.0.1 without dropping a request.",
    },
  },
};

export function fmtClock(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export class Sim {
  readonly level: Level;
  readonly goal: Goal;
  private readonly random: () => number;

  t = 0;
  traffic = false;
  rate = 6;
  handled = 0;
  dropped = 0;
  downtime = 0;
  servers: Server[] = [];
  lb = false;
  requests: Request[] = [];
  history: Bucket[] = [];
  log: LogEntry[] = [];
  // set once the goal is met. the clock and traffic stop.
  done = false;

  private acc = 0;
  private nextServer = 1;
  private rr = 0;
  private healthTimer = HEALTH_SECS;
  private bucket: Bucket = { h: 0, d: 0, off: false };
  private nextSec = 1;
  private warnedBusy = false;
  private warnedNoPool = false;
  private events: SimEvent[] = [];

  constructor({ level, random = Math.random }: SimOptions) {
    this.level = level;
    this.goal = LEVELS[level].goal;
    this.random = random;
    this.restart();
  }

  restart(): void {
    this.t = 0;
    this.traffic = false;
    this.handled = 0;
    this.dropped = 0;
    this.downtime = 0;
    this.servers = [];
    this.lb = false;
    this.requests = [];
    this.history = [];
    this.log = [];
    this.done = false;
    this.acc = 0;
    this.nextServer = 1;
    this.rr = 0;
    this.healthTimer = HEALTH_SECS;
    this.bucket = { h: 0, d: 0, off: false };
    this.nextSec = 1;
    this.warnedBusy = false;
    this.warnedNoPool = false;
    this.events = [];
    this.addServer();
    this.say(`Level ${this.level} started. web-01 online on v1.0.0`);
  }

  // events since the last call: the renderer turns them into rings and
  // shards. calling this hands them over and clears the queue.
  takeEvents(): SimEvent[] {
    const out = this.events;
    this.events = [];
    return out;
  }

  /* ---------- controls ---------- */

  setTraffic(on: boolean): void {
    if (this.traffic === on || this.done) return;
    this.traffic = on;
    // a saturation warning is worth repeating once the operator changes something
    if (!on) this.warnedBusy = false;
    this.say(
      on ? `Traffic started at ${this.rate} requests/s` : "Traffic stopped"
    );
  }

  setRate(rate: number): void {
    const clamped = Math.max(1, Math.min(MAX_RATE, rate));
    if (clamped !== this.rate) this.warnedBusy = false;
    this.rate = clamped;
  }

  addServer(): Server | null {
    if (this.servers.length >= MAX_SERVERS || this.done) return null;
    const n = this.nextServer++;
    const server: Server = {
      name: `web-0${n}`,
      online: true,
      patch: 0,
      patchLeft: 0,
      jobs: [],
      served: 0,
      inPool: true,
      lbHealthy: true,
    };
    this.servers.push(server);
    if (n > 1) {
      this.say(
        this.lb
          ? `${server.name} added and joined the pool`
          : `${server.name} added. Nothing sends it traffic: the users only know the address of web-01.`
      );
    }
    return server;
  }

  get canAddServer(): boolean {
    return this.servers.length < MAX_SERVERS && !this.done;
  }

  // the last server stays, and without a balancer so does web-01: it is the
  // only address the users know
  canRemoveServer(server: Server): boolean {
    if (this.done || this.servers.length <= 1) return false;
    if (!this.lb && this.servers[0] === server) return false;
    return true;
  }

  removeServer(server: Server): boolean {
    if (!this.canRemoveServer(server)) return false;
    const cut =
      server.jobs.length +
      this.requests.filter(r => r.server === server).length;
    this.requests = this.requests.filter(r => r.server !== server);
    this.servers = this.servers.filter(s => s !== server);
    if (cut) this.drop(cut);
    this.say(
      `${server.name} removed${cut ? ` (${cut} in-flight requests lost)` : ""}`
    );
    return true;
  }

  installLB(): boolean {
    if (this.lb || this.level !== 2 || this.done) return false;
    this.lb = true;
    for (const s of this.servers) {
      s.inPool = true;
      s.lbHealthy = s.online;
    }
    this.say(
      `lb-01 installed. Traffic now goes to the balancer, which spreads it across ${plural(this.servers.length, "server")}`
    );
    return true;
  }

  // a server at the goal version has nothing left to install
  upToDate(server: Server): boolean {
    return server.patch >= this.goal.patches;
  }

  startPatch(server: Server): void {
    if (!server.online || this.done || this.upToDate(server)) return;
    server.online = false;
    server.patchLeft = PATCH_SECS;
    const cut = server.jobs.length;
    server.jobs = [];
    if (cut) {
      this.drop(cut);
      this.handled -= cut;
      server.served -= cut;
    }
    const drained = this.lb && !server.inPool;
    let why = "";
    if (this.lb && server.inPool) {
      why =
        ". It was still in the pool, so the balancer keeps sending it traffic until a health check fails.";
    } else if (drained) {
      why = ". Drained first, so nobody notices.";
    }
    const cutNote = cut ? ` (${cut} in-flight requests cut)` : "";
    this.say(`Patching ${server.name}, it is offline${cutNote}${why}`);
  }

  toggleDrain(server: Server): void {
    if (this.done) return;
    server.inPool = !server.inPool;
    if (server.inPool) {
      server.lbHealthy = server.online;
      this.say(`${server.name} returned to the pool`);
      this.checkGoal();
    } else {
      this.say(
        `Draining ${server.name}: no new requests, in-flight ones finish`
      );
    }
  }

  /* ---------- queries ---------- */

  inflight(server: Server): number {
    return (
      server.jobs.length + this.requests.filter(r => r.server === server).length
    );
  }

  eligible(server: Server): boolean {
    return server.inPool && server.lbHealthy;
  }

  // is anything able to take a request right now
  get reachable(): boolean {
    if (this.lb) return this.servers.some(s => s.online && this.eligible(s));
    return this.servers[0]?.online ?? false;
  }

  get availability(): number {
    const total = this.handled + this.dropped;
    return total ? this.handled / total : 1;
  }

  // true when no request was ever sent: a patch with no users is not a result
  get quiet(): boolean {
    return this.handled + this.dropped === 0;
  }

  // servers that have reached the goal's patch level and are back in service.
  // a patched server still drained does not count: the job is not done until
  // it is taking traffic again
  get patchedCount(): number {
    return this.servers.filter(
      s => s.patch >= this.goal.patches && s.online && s.inPool
    ).length;
  }

  private checkGoal(): void {
    if (!this.done && this.patchedCount >= this.goal.servers) this.finish();
  }

  /* ---------- time ---------- */

  step(dt: number): void {
    if (this.done) return;
    this.t += dt;
    this.tickServers(dt);
    const reachable = this.reachable;
    if (!reachable) {
      this.downtime += dt;
      this.bucket.off = true;
    }

    if (this.traffic) {
      this.acc += this.rate * dt;
      while (this.acc >= 1) {
        this.acc -= 1;
        this.events.push({ type: "sent" });
        this.spawn();
      }
    }

    const live = this.requests;
    this.requests = [];
    for (const request of live) {
      request.p += dt / request.dur;
      if (request.p >= 1) this.arrive(request);
      else this.requests.push(request);
    }

    if (this.t >= this.nextSec) {
      this.nextSec++;
      this.history.push(this.bucket);
      if (this.history.length > HISTORY_SECS) this.history.shift();
      this.bucket = { h: 0, d: 0, off: !reachable };
    }
  }

  private tickServers(dt: number): void {
    for (const s of this.servers) {
      if (!s.online) {
        s.patchLeft -= dt;
        if (s.patchLeft <= 0) this.finishPatch(s);
      }
      s.jobs = s.jobs.filter(end => end > this.t);
    }
    if (this.lb) {
      this.healthTimer -= dt;
      if (this.healthTimer <= 0) {
        this.healthTimer = HEALTH_SECS;
        this.healthCheck();
      }
    }
  }

  private finishPatch(server: Server): void {
    server.online = true;
    server.patch++;
    const note =
      this.lb && !server.inPool
        ? ". Still drained; return it to the pool when ready."
        : "";
    this.say(`${server.name} back online on v1.0.${server.patch}${note}`);
    this.checkGoal();
  }

  private finish(): void {
    this.done = true;
    this.traffic = false;
    this.requests = [];
    let outcome: string;
    if (this.quiet) {
      outcome =
        "The patch went on, but there were no users. Start the traffic and try again.";
    } else if (this.dropped) {
      outcome = `${this.dropped.toLocaleString()} requests dropped, ${this.downtime.toFixed(1)} s of downtime.`;
    } else {
      outcome = "Not one request dropped.";
    }
    this.say(`Goal reached at ${fmtClock(this.t)}. ${outcome}`);
  }

  private healthCheck(): void {
    for (const s of this.servers) {
      if (!s.inPool) continue;
      if (s.lbHealthy && !s.online) {
        s.lbHealthy = false;
        this.say(
          `Health check failed for ${s.name}, lb-01 stops sending it traffic`
        );
      } else if (!s.lbHealthy && s.online) {
        s.lbHealthy = true;
        this.say(`Health check passed for ${s.name}, in rotation`);
      }
    }
  }

  // round robin over the pool, skipping anything drained or unhealthy
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
    const jitter = this.random() - 0.5;
    if (this.lb) {
      this.requests.push({
        leg: "lb",
        from: "users",
        p: 0,
        dur: 0.5,
        server: null,
        jitter,
      });
    } else {
      this.requests.push({
        leg: "server",
        from: "users",
        p: 0,
        dur: 1.1,
        server: this.servers[0],
        jitter,
      });
    }
  }

  private arrive(request: Request): void {
    if (request.leg === "lb") {
      const s = this.pick();
      if (!s) {
        this.drop();
        this.events.push({ type: "dropped", request });
        if (!this.warnedNoPool) {
          this.warnedNoPool = true;
          this.say(
            "lb-01 has no healthy server in the pool, requests are dropped at the balancer"
          );
        }
        return;
      }
      this.warnedNoPool = false;
      this.requests.push({
        leg: "server",
        from: "lb",
        p: 0,
        dur: 0.6,
        server: s,
        jitter: this.random() - 0.5,
      });
      return;
    }

    const s = request.server;
    if (s && s.online && s.jobs.length < WORKERS) {
      s.jobs.push(this.t + SERVICE_SECS);
      s.served++;
      this.handled++;
      this.bucket.h++;
      this.events.push({ type: "served", request });
      return;
    }

    this.drop();
    this.events.push({ type: "dropped", request });
    if (s && s.online && !this.warnedBusy) {
      this.warnedBusy = true;
      const fix =
        this.level === 2 ? " or spread the load over more servers." : ".";
      this.say(
        `All workers on ${s.name} are busy, requests are being dropped. Lower the rate${fix}`
      );
    }
  }

  private drop(n = 1): void {
    this.dropped += n;
    this.bucket.d += n;
  }

  private say(msg: string): void {
    this.log.unshift({ t: this.t, msg });
    if (this.log.length > 60) this.log.pop();
  }
}
