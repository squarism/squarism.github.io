<script setup lang="ts">
// split a column under traffic. the sim lives in sim.ts and is wrapped in
// shallowReactive(): the clock changes every frame, which re-renders the
// template, and the template reads nested state fresh each time. this file
// adds the toolbox, the table view, the app schema panel, and the canvas.
import { onMounted, onUnmounted, ref, shallowReactive } from "vue";
import {
  APP_QUERIES,
  GOAL_TEXT,
  INTRO,
  MAX_RATE,
  OPS,
  Sim,
  TITLE,
  UPGRADE_SECS,
  fmtClock,
  joinName,
  type AppVersion,
  type Columns,
  type OpId,
  type Request,
  type Row,
  type Server,
} from "./sim";

const sim = shallowReactive(new Sim()) as Sim;

const root = ref<HTMLElement | null>(null);
const stage = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const usersBox = ref<HTMLElement | null>(null);
const serverEls = new Map<string, HTMLElement>();

function setServerEl(name: string, el: Element | null | unknown): void {
  if (el instanceof HTMLElement) serverEls.set(name, el);
  else serverEls.delete(name);
}

const rate = ref(4);

function toggleTraffic(): void {
  sim.setTraffic(!sim.traffic);
}

function onRate(): void {
  sim.setRate(rate.value);
}

function restart(): void {
  sim.restart();
  sim.setRate(rate.value);
  fx = [];
}

/* ---------- read-side helpers, re-run every render ---------- */

function availability(): string {
  const pct = sim.availability * 100;
  return `${pct.toFixed(sim.failed ? 2 : 0)}%`;
}

function strip(): string[] {
  const h = sim.history;
  const off = 60 - h.length;
  return Array.from({ length: 60 }, (_, i) => {
    const b = h[i - off];
    if (!b) return "";
    if (b.failed > 0) return "bad";
    if (b.off) return "down";
    if (b.wrong > 0) return "wrong";
    return b.ok > 0 ? "ok" : "";
  });
}

interface ServerView {
  server: Server;
  status: string;
  out: boolean;
  upgradePct: number;
}

function serverViews(): ServerView[] {
  return sim.servers.map(s => {
    const out = !s.inPool;
    let status: string;
    if (!s.online) status = "Upgrading";
    else if (out) {
      const n = sim.requests.filter(r => r.server === s).length;
      status = n ? `Draining, ${n} in flight` : "Drained";
    } else if (!s.lbHealthy) status = "Waiting for health check";
    else if (sim.missingColumns(s.version).length) status = "Failing";
    else status = "Online";
    return {
      server: s,
      status,
      out,
      upgradePct: s.online
        ? 0
        : Math.min(100, (1 - s.upgradeLeft / UPGRADE_SECS) * 100),
    };
  });
}

function opRunning(id: OpId): boolean {
  return sim.op?.id === id;
}

function opPct(id: OpId): number {
  const op = sim.op;
  if (!op || op.id !== id) return 0;
  if (op.id === "copy") return (op.cursor / sim.rows.length) * 100;
  return (1 - op.left / op.total) * 100;
}

// live column list for the table header
function liveColumns(): { key: keyof Columns | "id"; label: string }[] {
  const cols: { key: keyof Columns | "id"; label: string }[] = [
    { key: "id", label: "id" },
  ];
  // the old columns on the left, the new one on the right
  if (sim.columns.firstName)
    cols.push({ key: "firstName", label: "first_name" });
  if (sim.columns.lastName) cols.push({ key: "lastName", label: "last_name" });
  if (sim.columns.name) cols.push({ key: "name", label: "name" });
  return cols;
}

function cell(row: Row, key: keyof Columns | "id"): string {
  if (key === "id") return String(row.id);
  const v = row[key];
  return v === null ? "null" : v;
}

// is this cell's column set disagreeing with what was last written
function cellBad(row: Row, key: keyof Columns | "id"): boolean {
  if (key === "id") return false;
  if (key === "name") return row.name !== row.truth;
  return joinName(row.firstName, row.lastName) !== row.truth;
}

function isCursor(index: number): boolean {
  return sim.op?.id === "copy" && sim.op.cursor === index;
}

// the marker beside a row fades out over a second and a half
function marker(row: Row): { kind: string; opacity: number } | null {
  if (!row.lastOp) return null;
  const age = sim.t - row.lastOp.at;
  if (age > 1.5) return null;
  return { kind: row.lastOp.kind, opacity: 1 - age / 1.5 };
}

// split a query into text and column tokens so the panel can colour them
const COLUMN_TOKEN = /(first_name|last_name|\bname\b)/g;
function queryParts(q: string): { text: string; col: keyof Columns | null }[] {
  const parts: { text: string; col: keyof Columns | null }[] = [];
  let last = 0;
  for (const m of q.matchAll(COLUMN_TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) parts.push({ text: q.slice(last, i), col: null });
    const tok = m[0];
    parts.push({
      text: tok,
      col:
        tok === "first_name"
          ? "firstName"
          : tok === "last_name"
            ? "lastName"
            : "name",
    });
    last = i + tok.length;
  }
  if (last < q.length) parts.push({ text: q.slice(last), col: null });
  return parts;
}

function versionCount(v: AppVersion): number {
  return sim.servers.filter(s => s.version === v).length;
}

/* ---------- canvas ---------- */

interface Point {
  x: number;
  y: number;
}
interface Box {
  x: number;
  top: number;
  bottom: number;
  w: number;
}
interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}
interface Fx {
  x: number;
  y: number;
  life: number;
  max: number;
  kind: "ring" | "ring-wrong" | "shard";
  vx?: number;
  vy?: number;
}

let fx: Fx[] = [];
let colors = { ok: "", bad: "", wrong: "", read: "", write: "", muted: "" };
let W = 0;
let H = 0;
let stageRect: Rect = { left: 0, top: 0, width: 0, height: 0 };
let source: Point = { x: 0, y: 0 };
const serverBoxes = new Map<string, Box>();
let raf = 0;
let last = 0;
let frame = 0;
let observer: IntersectionObserver | null = null;

function readColors(): void {
  if (!root.value) return;
  const cs = getComputedStyle(root.value);
  const get = (k: string) => cs.getPropertyValue(k).trim();
  colors = {
    ok: get("--ok"),
    bad: get("--bad"),
    wrong: get("--wrong"),
    read: get("--read"),
    write: get("--write"),
    muted: get("--muted"),
  };
}

function rel(el: Element): Box {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - stageRect.left,
    top: r.top - stageRect.top,
    bottom: r.bottom - stageRect.top,
    w: r.width,
  };
}

function layout(): void {
  const cv = canvas.value;
  const st = stage.value;
  if (!cv || !st) return;
  stageRect = st.getBoundingClientRect();
  const { width, height } = stageRect;
  const d = window.devicePixelRatio || 1;
  if (width !== W || height !== H) {
    W = width;
    H = height;
    cv.width = width * d;
    cv.height = height * d;
    cv.getContext("2d")?.setTransform(d, 0, 0, d, 0, 0);
  }
  if (usersBox.value) {
    const u = rel(usersBox.value);
    source = { x: u.x, y: u.bottom };
  }
  serverBoxes.clear();
  for (const [name, el] of serverEls) serverBoxes.set(name, rel(el));
}

function target(request: Request): Point {
  const box = serverBoxes.get(request.server.name);
  if (!box) return source;
  return { x: box.x + request.jitter * box.w * 0.6, y: box.top };
}

function consumeEvents(): void {
  for (const ev of sim.takeEvents()) {
    if (ev.type === "served") {
      const to = target(ev.request);
      fx.push({
        x: to.x,
        y: to.y,
        life: 0.3,
        max: 0.3,
        kind: ev.wrong ? "ring-wrong" : "ring",
      });
    } else if (ev.type === "failed") {
      const to = ev.request
        ? target(ev.request)
        : ev.server && serverBoxes.get(ev.server.name)
          ? {
              x: serverBoxes.get(ev.server.name)!.x,
              y: serverBoxes.get(ev.server.name)!.top,
            }
          : { x: source.x, y: source.y + 24 };
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI * (0.15 + Math.random() * 0.7);
        const v = 80 + Math.random() * 140;
        fx.push({
          x: to.x,
          y: to.y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 0.5,
          max: 0.5,
          kind: "shard",
        });
      }
    }
  }
}

function tickFx(dt: number): void {
  for (const f of fx) {
    f.life -= dt;
    if (f.vx !== undefined && f.vy !== undefined) {
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.vy += 500 * dt;
    }
  }
  fx = fx.filter(f => f.life > 0);
}

function draw(): void {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  ctx.lineCap = "round";
  // the balancer's view of the pool: a line to every server
  ctx.lineWidth = 2;
  for (const s of sim.servers) {
    const box = serverBoxes.get(s.name);
    if (!box) continue;
    const sick = s.inPool && !s.lbHealthy;
    ctx.strokeStyle = !s.inPool ? colors.muted : sick ? colors.bad : colors.ok;
    ctx.setLineDash(s.inPool && !sick ? [] : [5, 6]);
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(box.x, box.top);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  for (const r of sim.requests) {
    const to = target(r);
    ctx.lineWidth = 3;
    ctx.strokeStyle = r.kind === "write" ? colors.write : colors.read;
    const p0 = Math.max(0, r.p - 0.06);
    ctx.beginPath();
    ctx.moveTo(
      source.x + (to.x - source.x) * p0,
      source.y + (to.y - source.y) * p0
    );
    ctx.lineTo(
      source.x + (to.x - source.x) * r.p,
      source.y + (to.y - source.y) * r.p
    );
    ctx.stroke();
  }
  for (const f of fx) {
    const a = f.life / f.max;
    ctx.globalAlpha = a;
    if (f.kind === "shard") {
      ctx.fillStyle = colors.bad;
      ctx.fillRect(f.x - 2, f.y - 2, 4, 4);
    } else {
      ctx.strokeStyle = f.kind === "ring" ? colors.ok : colors.wrong;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 4 + (1 - a) * 12, Math.PI, 0);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

function loop(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  layout();
  sim.step(dt);
  consumeEvents();
  tickFx(dt);
  draw();
  if (++frame % 60 === 0) readColors();
  raf = requestAnimationFrame(loop);
}

function start(): void {
  if (raf) return;
  last = performance.now();
  raf = requestAnimationFrame(loop);
}

function stop(): void {
  if (!raf) return;
  cancelAnimationFrame(raf);
  raf = 0;
}

onMounted(() => {
  readColors();
  observer = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) start();
      else stop();
    }
  });
  if (stage.value) observer.observe(stage.value);
});

onUnmounted(() => {
  stop();
  observer?.disconnect();
});
</script>

<template>
  <div ref="root" class="feature-wide sm not-prose" :class="{ done: sim.done }">
    <header class="head">
      <div>
        <h3 class="title">{{ TITLE }}</h3>
        <p class="intro">{{ INTRO }}</p>
        <p class="goal"><span class="goal-label">Goal</span> {{ GOAL_TEXT }}</p>
      </div>
      <button type="button" @click="restart">Restart</button>
    </header>

    <!-- toolbox: every operation, always visible, never greyed out for order -->
    <div class="toolbox">
      <div class="tool-group">
        <div class="tool-label">Database</div>
        <div class="ops">
          <div
            v-for="op in OPS"
            :key="op.id"
            class="op"
            :class="{ running: opRunning(op.id) }"
          >
            <div class="op-name">{{ op.label }}</div>
            <pre class="sql">{{ op.sql }}</pre>
            <button
              type="button"
              class="primary"
              :disabled="!!sim.opBlocked(op.id)"
              :title="sim.opBlocked(op.id) ?? ''"
              @click="sim.runOp(op.id)"
            >
              {{ opRunning(op.id) ? "Running…" : "Run" }}
            </button>
            <div class="bar" :class="{ live: opRunning(op.id) }">
              <i :style="{ width: opPct(op.id) + '%' }"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="tool-group">
        <div class="tool-label">Servers</div>
        <div class="server-tools">
          <button
            type="button"
            :disabled="!sim.canAddServer"
            @click="sim.addServer(1)"
          >
            Add a server, app v1
          </button>
          <button
            type="button"
            :disabled="!sim.canAddServer"
            @click="sim.addServer(2)"
          >
            Add a server, app v2
          </button>
        </div>
      </div>
    </div>

    <div class="grid">
      <section ref="stage" class="stage" aria-label="Simulation">
        <canvas ref="canvas"></canvas>

        <div ref="usersBox" class="users">
          <div class="row">
            <span class="tag">
              <svg
                class="cloud"
                viewBox="0 0 24 16"
                width="24"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M6 15a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17 5.5a4.75 4.75 0 0 1 1.5 9.5Z"
                />
              </svg>
              Users
            </span>
            <button
              type="button"
              :class="{ live: sim.traffic }"
              :disabled="sim.done"
              @click="toggleTraffic"
            >
              {{ sim.traffic ? "Stop traffic" : "Start traffic" }}
            </button>
          </div>
          <label>
            <span>Rate</span>
            <span
              ><b>{{ rate }}</b> requests/s, 30% writes</span
            >
            <input
              v-model.number="rate"
              type="range"
              min="1"
              :max="MAX_RATE"
              :disabled="sim.done"
              @input="onRate"
            />
          </label>
        </div>

        <div class="servers">
          <div
            v-for="v in serverViews()"
            :key="v.server.name"
            :ref="el => setServerEl(v.server.name, el)"
            class="server"
            :class="{
              offline: !v.server.online,
              out: v.out,
              failing: v.status === 'Failing',
            }"
          >
            <div class="row">
              <div>
                <span class="name">{{ v.server.name }}</span>
                <span class="ver" :class="'v' + v.server.version"
                  >app v{{ v.server.version }}</span
                >
              </div>
              <span class="pill">{{ v.status }}</span>
            </div>
            <div class="counts">
              <span>served {{ v.server.served }}</span>
              <span :class="{ bad: v.server.failed }"
                >failed {{ v.server.failed }}</span
              >
              <span :class="{ wrong: v.server.wrong }"
                >wrong {{ v.server.wrong }}</span
              >
            </div>
            <div class="btns">
              <button
                type="button"
                class="primary"
                :disabled="!sim.canUpgrade(v.server)"
                @click="sim.startUpgrade(v.server)"
              >
                {{
                  v.server.online
                    ? v.server.version === 1
                      ? "Upgrade to app v2"
                      : "On app v2"
                    : "Upgrading…"
                }}
              </button>
              <div class="btn-row">
                <button
                  type="button"
                  :disabled="sim.done"
                  @click="sim.toggleDrain(v.server)"
                >
                  {{ v.server.inPool ? "Drain" : "Return" }}
                </button>
                <button
                  type="button"
                  :disabled="!sim.canRemoveServer(v.server)"
                  @click="sim.removeServer(v.server)"
                >
                  Remove
                </button>
              </div>
            </div>
            <div class="bar" :class="{ live: !v.server.online }">
              <i :style="{ width: v.upgradePct + '%' }"></i>
            </div>
          </div>
        </div>

        <!-- the table, live -->
        <div class="table">
          <div class="table-head">
            <span class="name">users</span>
            <span class="muted">{{ sim.rows.length }} rows</span>
            <span class="muted" :class="{ on: sim.trigger }">
              trigger users_name_sync: {{ sim.trigger ? "on" : "off" }}
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th class="mark"></th>
                <th v-for="c in liveColumns()" :key="c.key">
                  {{ c.label
                  }}<small>{{ c.key === "id" ? "int" : "text" }}</small>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in sim.rows"
                :key="row.id"
                :class="{ cursor: isCursor(i), stale: !sim.consistent(row) }"
              >
                <td class="mark">
                  <i
                    v-if="marker(row)"
                    :class="marker(row)?.kind"
                    :style="{ opacity: marker(row)?.opacity }"
                    :title="marker(row)?.kind"
                    >{{ marker(row)?.kind === "copy" ? "›" : "" }}</i
                  >
                </td>
                <td
                  v-for="c in liveColumns()"
                  :key="c.key"
                  :class="{
                    bad: cellBad(row, c.key),
                    null: cell(row, c.key) === 'null',
                  }"
                >
                  {{ cell(row, c.key) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="legend">
            <span><i class="read"></i> read</span>
            <span><i class="write"></i> write</span>
            <span><i class="trigger"></i> trigger copied it across</span>
            <span><i class="copy">›</i> copy script</span>
            <span><i class="wrong"></i> wrong data served</span>
            <span><i class="failed"></i> failed</span>
            <span class="stale-note"
              >red text: differs from what was last written</span
            >
          </div>
        </div>

        <div v-if="sim.done" class="result" role="status">
          <div class="result-title">Goal reached at {{ fmtClock(sim.t) }}</div>
          <dl>
            <div class="pair">
              <dt>Failed</dt>
              <dd :class="{ bad: sim.failed > 0 }">{{ sim.failed }}</dd>
            </div>
            <div class="pair">
              <dt>Wrong data served</dt>
              <dd :class="{ wrong: sim.wrong > 0 }">{{ sim.wrong }}</dd>
            </div>
            <div class="pair">
              <dt>Rows out of sync</dt>
              <dd :class="{ bad: sim.outOfSync.length > 0 }">
                {{ sim.outOfSync.length }}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <aside class="side">
        <div class="card big">
          <div class="num">{{ sim.failed }}</div>
          <div>requests failed</div>
        </div>
        <div class="card">
          <dl>
            <dt>Clock</dt>
            <dd>{{ fmtClock(sim.t) }}</dd>
            <dt>Handled</dt>
            <dd>{{ sim.handled }}</dd>
            <dt>Availability</dt>
            <dd>{{ availability() }}</dd>
            <dt>Wrong data served</dt>
            <dd :class="{ wrong: sim.wrong > 0 }">{{ sim.wrong }}</dd>
            <dt>Rows out of sync</dt>
            <dd :class="{ bad: sim.outOfSync.length > 0 }">
              {{ sim.outOfSync.length }}
            </dd>
          </dl>
        </div>

        <!-- what each app version actually runs, coloured by the live schema -->
        <div class="card schema">
          <h4>App schema</h4>
          <div v-for="v in [1, 2] as AppVersion[]" :key="v" class="app">
            <div class="app-head">
              <span class="ver" :class="'v' + v">app v{{ v }}</span>
              <span class="muted"
                >on {{ versionCount(v) }}
                {{ versionCount(v) === 1 ? "server" : "servers" }}</span
              >
            </div>
            <pre
              class="sql"
            ><template v-for="(p, i) in queryParts(APP_QUERIES[v].read)" :key="i"><span v-if="p.col" :class="sim.columns[p.col] ? 'col-ok' : 'col-missing'">{{ p.text }}</span><template v-else>{{ p.text }}</template></template></pre>
            <pre
              class="sql"
            ><template v-for="(p, i) in queryParts(APP_QUERIES[v].write)" :key="i"><span v-if="p.col" :class="sim.columns[p.col] ? 'col-ok' : 'col-missing'">{{ p.text }}</span><template v-else>{{ p.text }}</template></template></pre>
          </div>
          <small
            >A column in red does not exist in the table right now. That query
            fails.</small
          >
        </div>

        <div class="card">
          <h4>Last 60 seconds</h4>
          <div class="strip">
            <i v-for="(cls, i) in strip()" :key="i" :class="cls"></i>
          </div>
          <small
            >Green served everything, amber served wrong data, red failed
            requests, hatched had no working server.</small
          >
        </div>
        <div class="card">
          <h4>Event log</h4>
          <ul class="log">
            <li
              v-for="(entry, i) in sim.log"
              :key="sim.log.length - i"
              :class="entry.level"
            >
              <span>{{ fmtClock(entry.t) }}</span
              >{{ entry.msg }}
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.sm {
  --ok: var(--success);
  --bad: var(--error);
  --wrong: var(--warning);
  --read: var(--warning);
  --write: #7c97ff;
  --on-accent: #111;
  width: 100%;
  box-sizing: border-box;
  padding: 24px;
  margin: 40px 0 48px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.45;
}
.sm *,
.sm *::before,
.sm *::after {
  box-sizing: border-box;
}
.muted {
  color: var(--muted);
}
.bad {
  color: var(--bad);
}
.wrong {
  color: var(--wrong);
}

.head {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
}
.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--fg);
}
.intro {
  margin: 6px 0 0;
  max-width: 70ch;
  color: var(--muted);
  text-wrap: pretty;
}
.goal {
  margin: 8px 0 0;
  color: var(--body);
  max-width: 70ch;
}
.goal-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-text);
  margin-right: 8px;
}

button {
  font: 600 14px var(--font-sans);
  color: var(--fg);
  background: transparent;
  border: 1.5px solid var(--fg);
  border-radius: 0;
  padding: 7px 12px;
  cursor: pointer;
}
button:hover:not(:disabled) {
  background: var(--fg);
  color: var(--bg);
}
button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
button.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
}
button.primary:hover:not(:disabled) {
  filter: brightness(1.12);
  background: var(--accent);
  color: var(--on-accent);
}

/* ----- toolbox ----- */
.toolbox {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}
.tool-group {
  border: 1px solid var(--border);
  background: var(--card);
  padding: 10px 12px;
}
.tool-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}
.ops {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}
.op {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  min-width: 0;
}
.op.running {
  border-color: var(--accent);
}
.op-name {
  font-weight: 600;
  font-size: 14px;
}
.sql {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--body);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  flex: 1;
}
.op button {
  padding: 6px 8px;
  font-size: 13px;
}
.server-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  align-items: center;
}
.hint {
  color: var(--muted);
  font-size: 14px;
}

/* ----- stage + side ----- */
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
}
.stage {
  position: relative;
  max-width: none;
  margin: 0;
  background: var(--card);
  border: 1px solid var(--border);
  overflow: hidden;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 56px 56px;
  background-position: -1px -1px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  padding: 14px;
}
.stage canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
/* everything on the stage sits above the canvas, except the result panel,
   which is positioned on its own */
.stage > div:not(.result) {
  position: relative;
  z-index: 2;
}

.users {
  background: var(--fg);
  color: var(--bg);
  padding: 10px 14px 12px;
  width: min(320px, 84vw);
  display: grid;
  gap: 8px;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.tag {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.cloud {
  opacity: 0.8;
}
.users button {
  border-color: var(--bg);
  color: var(--bg);
}
.users button:hover:not(:disabled) {
  background: var(--bg);
  color: var(--fg);
}
.users button.live,
.users button.live:hover {
  background: var(--read);
  border-color: var(--read);
  color: #111;
}
.users label {
  font-size: 13px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px;
}
.users input[type="range"] {
  width: 100%;
  accent-color: var(--read);
  margin: 0;
}

.servers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  width: 100%;
}
.server {
  flex: 1 1 150px;
  max-width: 230px;
  min-width: 0;
  background: var(--bg);
  border: 2px solid var(--ok);
  padding: 8px 10px;
}
.server.offline {
  border-color: var(--bad);
  border-style: dashed;
}
.server.out:not(.offline) {
  border-color: var(--muted);
}
.server.failing:not(.offline):not(.out) {
  border-color: var(--bad);
}
.server .row {
  gap: 6px;
  flex-wrap: wrap;
}
.server button {
  padding: 6px 8px;
  font-size: 13px;
}
.name {
  font-weight: 600;
}
.ver {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  margin-left: 6px;
  padding: 1px 6px;
  border: 1px solid currentColor;
}
.ver.v1 {
  color: var(--muted);
}
.ver.v2 {
  color: var(--write);
}
.pill {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  background: var(--ok);
  color: var(--bg);
}
.offline .pill,
.failing .pill {
  background: var(--bad);
}
.out:not(.offline) .pill {
  background: var(--muted);
}
.counts {
  display: flex;
  gap: 10px;
  margin: 8px 0;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}
.btns {
  display: grid;
  gap: 6px;
}
.btn-row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 6px;
}
.bar {
  height: 4px;
  background: var(--border);
  margin-top: 8px;
  overflow: hidden;
  visibility: hidden;
}
.bar.live {
  visibility: visible;
}
.bar i {
  display: block;
  height: 100%;
  background: var(--accent);
}
.server .bar i {
  background: var(--bad);
}

/* ----- the table ----- */
.table {
  width: min(720px, 100%);
  background: var(--bg);
  border: 2px solid var(--fg);
  padding: 10px 14px 12px;
}
.table-head {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  align-items: baseline;
  margin-bottom: 6px;
}
.table-head .on {
  color: var(--ok);
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
th {
  text-align: left;
  font-weight: 600;
  padding: 6px 8px 8px;
  border-bottom: 2px solid var(--fg);
  font-family: var(--font-mono);
  font-size: 13px;
}
th small {
  display: block;
  font-weight: 400;
  color: var(--muted);
  font-size: 11px;
}
td {
  padding: 5px 8px;
  border-bottom: 1px solid var(--border);
  font-variant-numeric: tabular-nums;
}
td.bad {
  color: var(--bad);
  font-weight: 600;
}
td.null {
  color: var(--muted);
  font-style: italic;
}
tr.cursor td {
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}
.mark {
  width: 18px;
  padding-left: 0;
  padding-right: 0;
}
td.mark i,
.legend i {
  display: inline-block;
  width: 10px;
  height: 10px;
  vertical-align: middle;
}
td.mark i.read,
.legend i.read {
  background: var(--read);
  height: 3px;
}
td.mark i.write,
.legend i.write {
  background: var(--write);
  height: 3px;
}
td.mark i.trigger,
.legend i.trigger {
  background: var(--write);
  border-radius: 50%;
  width: 8px;
  height: 8px;
}
/* the copy script writes to the column on the right, so: a chevron */
td.mark i.copy,
.legend i.copy {
  background: none;
  width: auto;
  height: auto;
  color: var(--ok);
  font-weight: 700;
  font-size: 16px;
  line-height: 10px;
}
td.mark i.wrong,
.legend i.wrong {
  background: var(--wrong);
}
td.mark i.failed,
.legend i.failed {
  background: var(--bad);
}
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--muted);
}
.legend i {
  margin-right: 5px;
}
.stale-note {
  color: var(--bad);
  font-weight: 600;
}

/* ----- goal reached ----- */
.result {
  position: absolute;
  inset: auto 14px 14px 14px;
  z-index: 3;
  background: var(--bg);
  border: 2px solid var(--fg);
  padding: 16px 18px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px 24px;
}
.result-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
/* the stats are small tiles, label over number, so nothing has to line up */
.result dl {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 36px;
  margin: 0;
  min-width: 0;
}
.result .pair {
  display: grid;
  gap: 2px;
  text-align: center;
  white-space: nowrap;
}
.result dt {
  font-size: 12px;
  color: var(--muted);
}
.result dd {
  font-size: 20px;
  line-height: 1.1;
}
.done .stage {
  border-color: var(--fg);
}

/* ----- side ----- */
.side {
  display: grid;
  gap: 16px;
  align-content: start;
}
.card {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 14px 16px;
}
.num {
  font-family: var(--font-mono);
  font-size: 44px;
  font-weight: 600;
  line-height: 1;
  color: var(--bad);
  font-variant-numeric: tabular-nums;
}
.big div:last-child {
  color: var(--muted);
  font-size: 14px;
  margin-top: 4px;
}
dl {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 12px;
  margin: 0;
}
dt {
  color: var(--muted);
}
dd {
  margin: 0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  font-family: var(--font-mono);
}
.card h4 {
  font: 600 15px var(--font-sans);
  margin: 0;
  color: var(--fg);
}
.card small {
  color: var(--muted);
  display: block;
  margin-top: 8px;
}
.schema .app {
  margin-top: 10px;
  display: grid;
  gap: 4px;
}
.app-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
}
.app-head .ver {
  margin-left: 0;
}
.col-ok {
  color: var(--ok);
}
.col-missing {
  color: var(--bad);
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
}
.strip {
  display: grid;
  grid-template-columns: repeat(60, 1fr);
  gap: 1px;
  height: 28px;
  margin-top: 8px;
}
.strip i {
  background: var(--border);
}
.strip i.ok {
  background: var(--ok);
}
.strip i.wrong {
  background: var(--wrong);
}
.strip i.bad {
  background: var(--bad);
}
.strip i.down {
  background: repeating-linear-gradient(
    45deg,
    var(--bad) 0 2px,
    transparent 2px 4px
  );
}
.log {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  max-height: 240px;
  overflow: auto;
  font-size: 13px;
}
.log li {
  padding: 4px 0;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
}
.log li span {
  color: var(--muted);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  flex: none;
}
.log li.warn {
  color: var(--wrong);
}
.log li.bad {
  color: var(--bad);
}

@media (max-width: 1000px) {
  .ops {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 860px) {
  .sm {
    padding: 16px;
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .result {
    grid-template-columns: 1fr;
  }
  .result dl {
    justify-content: flex-start;
  }
}
</style>
