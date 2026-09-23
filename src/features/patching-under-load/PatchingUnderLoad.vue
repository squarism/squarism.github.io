<script setup lang="ts">
// one stage of the patching-under-load feature. level 1 is the single server,
// level 2 adds parts (servers, a load balancer). the sim lives in sim.ts and
// is wrapped in shallowReactive() so the template reads it directly. shallow
// on purpose: the clock changes every frame, which re-renders the template,
// and the template reads the nested server and request state fresh each time.
// deep reactivity would track every request moving every frame for nothing.
// this file adds the canvas (request paths, effects) and the controls.
import { onMounted, onUnmounted, ref, shallowReactive } from "vue";
import {
  LEVELS,
  HEALTH_SECS,
  MAX_RATE,
  PATCH_SECS,
  WORKERS,
  Sim,
  fmtClock,
  type Level,
  type Request,
  type Server,
} from "./sim";

const props = defineProps<{ level: Level }>();

const { title, intro, goal } = LEVELS[props.level];
const sim = shallowReactive(new Sim({ level: props.level })) as Sim;

const root = ref<HTMLElement | null>(null);
const stage = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const usersBox = ref<HTMLElement | null>(null);
const lbCard = ref<HTMLElement | null>(null);
const serverEls = new Map<string, HTMLElement>();

function setServerEl(name: string, el: Element | null | unknown): void {
  if (el instanceof HTMLElement) serverEls.set(name, el);
  else serverEls.delete(name);
}

const rate = ref(6);
// these are plain functions, not computeds: with a shallow sim nothing nested
// is tracked, so they are re-read on every render (every frame) instead
function hint(): string {
  return sim.lb
    ? "Drain a server, wait for it to empty, patch it, return it to the pool."
    : "Put a load balancer in front, then add servers behind it.";
}

function availability(): string {
  const pct = sim.availability * 100;
  return `${pct.toFixed(sim.dropped ? 2 : 0)}%`;
}

// strip cells for the last 60 seconds, oldest first, empty on the left
function strip(): string[] {
  const h = sim.history;
  const off = 60 - h.length;
  return Array.from({ length: 60 }, (_, i) => {
    const b = h[i - off];
    if (!b) return "";
    if (b.d > 0) return "bad";
    if (b.off) return "down";
    return b.h > 0 ? "ok" : "";
  });
}

interface ServerView {
  server: Server;
  status: string;
  idle: boolean;
  out: boolean;
  patchLabel: string;
  patchPct: number;
}

function serverViews(): ServerView[] {
  return sim.servers.map((s, i) => {
    const idle = !sim.lb && i > 0;
    const out = sim.lb && !s.inPool;
    let status: string;
    if (!s.online) status = "Patching";
    else if (idle) status = "Idle, no traffic";
    else if (out) {
      const n = sim.inflight(s);
      status = n ? `Draining, ${n} in flight` : "Drained, safe to patch";
    } else if (sim.lb && !s.lbHealthy) status = "Waiting for health check";
    else status = "Online";
    return {
      server: s,
      status,
      idle,
      out,
      patchLabel: !s.online
        ? "Patching…"
        : sim.upToDate(s)
          ? "Up to date"
          : `Install patch 1.0.${s.patch + 1}`,
      patchPct: s.online
        ? 0
        : Math.min(100, (1 - s.patchLeft / PATCH_SECS) * 100),
    };
  });
}

function poolState(s: Server): { cls: string; label: string } {
  if (!s.inPool) return { cls: "out", label: `${s.name} drained` };
  if (!s.lbHealthy) return { cls: "sick", label: `${s.name} unhealthy` };
  return { cls: "", label: s.name };
}

/* ---------- controls ---------- */

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

// the stage's position on the page. a plain object rather than a DOMRect
// because setup also runs on the server, where DOMRect does not exist.
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
  kind: "ring" | "shard";
  vx?: number;
  vy?: number;
}

let fx: Fx[] = [];
let colors = { ok: "", bad: "", request: "", muted: "" };
let W = 0;
let H = 0;
let stageRect: Rect = { left: 0, top: 0, width: 0, height: 0 };
let source: Point = { x: 0, y: 0 };
let lbBox: Box | null = null;
const serverBoxes = new Map<string, Box>();
let raf = 0;
let last = 0;
let frame = 0;
let observer: IntersectionObserver | null = null;

function readColors(): void {
  if (!root.value) return;
  const cs = getComputedStyle(root.value);
  colors = {
    ok: cs.getPropertyValue("--ok").trim(),
    bad: cs.getPropertyValue("--bad").trim(),
    request: cs.getPropertyValue("--request").trim(),
    muted: cs.getPropertyValue("--muted").trim(),
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
  lbBox = lbCard.value ? rel(lbCard.value) : null;
}

// start and end of a request's path on the canvas
function path(request: Request): { from: Point; to: Point } {
  const from: Point =
    request.from === "lb" && lbBox ? { x: lbBox.x, y: lbBox.bottom } : source;
  let to: Point = source;
  if (request.leg === "lb" && lbBox) {
    to = { x: lbBox.x + request.jitter * lbBox.w * 0.5, y: lbBox.top };
  } else if (request.server) {
    const box = serverBoxes.get(request.server.name);
    if (box) to = { x: box.x + request.jitter * box.w * 0.6, y: box.top };
  }
  return { from, to };
}

function consumeEvents(): void {
  for (const ev of sim.takeEvents()) {
    if (ev.type === "served") {
      const { to } = path(ev.request);
      fx.push({ x: to.x, y: to.y, life: 0.3, max: 0.3, kind: "ring" });
    } else if (ev.type === "dropped") {
      const { to } = path(ev.request);
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
  if (lbBox) {
    ctx.lineWidth = 2;
    for (const s of sim.servers) {
      const box = serverBoxes.get(s.name);
      if (!box) continue;
      const sick = s.inPool && !s.lbHealthy;
      ctx.strokeStyle = !s.inPool
        ? colors.muted
        : sick
          ? colors.bad
          : colors.ok;
      ctx.setLineDash(s.inPool && !sick ? [] : [5, 6]);
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(lbBox.x, lbBox.bottom);
      ctx.lineTo(box.x, box.top);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  for (const request of sim.requests) {
    const { from, to } = path(request);
    ctx.lineWidth = 3;
    ctx.strokeStyle = colors.request;
    const p0 = Math.max(0, request.p - 0.06 * (0.6 / request.dur));
    ctx.beginPath();
    ctx.moveTo(from.x + (to.x - from.x) * p0, from.y + (to.y - from.y) * p0);
    ctx.lineTo(
      from.x + (to.x - from.x) * request.p,
      from.y + (to.y - from.y) * request.p
    );
    ctx.stroke();
  }
  for (const f of fx) {
    const a = f.life / f.max;
    ctx.globalAlpha = a;
    if (f.kind === "ring") {
      ctx.strokeStyle = colors.ok;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 4 + (1 - a) * 12, Math.PI, 0);
      ctx.stroke();
    } else {
      ctx.fillStyle = colors.bad;
      ctx.fillRect(f.x - 2, f.y - 2, 4, 4);
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
  // only animate while on screen. the sim clock pauses with it.
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
  <div
    ref="root"
    class="feature-wide pul not-prose"
    :class="{ done: sim.done }"
  >
    <header class="head">
      <div>
        <h3 class="title">{{ title }}</h3>
        <p class="intro">{{ intro }}</p>
        <p class="goal"><span class="goal-label">Goal</span> {{ goal.text }}</p>
      </div>
      <button type="button" @click="restart">Restart</button>
    </header>

    <div v-if="level === 2" class="parts">
      <span class="parts-label">Parts</span>
      <button
        type="button"
        :disabled="sim.lb || sim.done"
        @click="sim.installLB()"
      >
        Add a load balancer
      </button>
      <button
        type="button"
        :disabled="!sim.canAddServer"
        @click="sim.addServer()"
      >
        Add a server
      </button>
      <span class="hint">{{ hint() }}</span>
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
              ><b>{{ rate }}</b> requests/s</span
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

        <div v-if="level === 2" class="lbzone">
          <div v-if="!sim.lb" class="drop">No load balancer</div>
          <div v-else ref="lbCard" class="lb">
            <div class="row">
              <span class="name">lb-01</span>
              <small>Round robin, health check every {{ HEALTH_SECS }} s</small>
            </div>
            <div class="pool">
              <span
                v-for="s in sim.servers"
                :key="s.name"
                :class="poolState(s).cls"
              >
                {{ poolState(s).label }}
              </span>
            </div>
          </div>
        </div>

        <div class="servers">
          <div
            v-for="v in serverViews()"
            :key="v.server.name"
            :ref="el => setServerEl(v.server.name, el)"
            class="server"
            :class="{ offline: !v.server.online, out: v.out || v.idle }"
          >
            <div class="row">
              <div>
                <span class="name">{{ v.server.name }}</span>
                <span class="ver">v1.0.{{ v.server.patch }}</span>
              </div>
              <span class="pill">{{ v.status }}</span>
            </div>
            <div class="slots" aria-hidden="true">
              <i
                v-for="j in WORKERS"
                :key="j"
                class="slot"
                :class="{ busy: v.server.online && j <= v.server.jobs.length }"
              ></i>
            </div>
            <div class="cap">Served {{ v.server.served.toLocaleString() }}</div>
            <div class="btns">
              <button
                type="button"
                class="primary"
                :disabled="
                  !v.server.online || sim.done || sim.upToDate(v.server)
                "
                @click="sim.startPatch(v.server)"
              >
                {{ v.patchLabel }}
              </button>
              <div v-if="level === 2" class="btn-row">
                <button
                  v-if="sim.lb"
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
            <div class="bar"><i :style="{ width: v.patchPct + '%' }"></i></div>
          </div>
        </div>

        <div
          v-if="sim.done"
          class="result"
          :class="{ quiet: sim.quiet }"
          role="status"
        >
          <div class="result-title">
            Goal reached at {{ fmtClock(sim.t) }}
            <span v-if="sim.quiet" class="result-note">
              You patched successfully, but there were no users. Start the
              traffic and try again.
            </span>
          </div>
          <dl v-if="!sim.quiet">
            <dt>Dropped</dt>
            <dd :class="{ bad: sim.dropped > 0 }">
              {{ sim.dropped.toLocaleString() }}
            </dd>
            <dt>Downtime</dt>
            <dd :class="{ bad: sim.downtime > 0 }">
              {{ sim.downtime.toFixed(1) }} s
            </dd>
            <dt>Availability</dt>
            <dd>{{ availability() }}</dd>
          </dl>
          <button type="button" @click="restart">Try again</button>
        </div>
      </section>

      <aside class="side">
        <div class="card big">
          <div class="num">{{ sim.dropped.toLocaleString() }}</div>
          <div>requests dropped</div>
        </div>
        <div class="card">
          <dl>
            <dt>Clock</dt>
            <dd>{{ fmtClock(sim.t) }}</dd>
            <dt>Service downtime</dt>
            <dd>{{ sim.downtime.toFixed(1) }} s</dd>
            <dt>Handled</dt>
            <dd>{{ sim.handled.toLocaleString() }}</dd>
            <dt>Availability</dt>
            <dd>{{ availability() }}</dd>
            <dt>Patched</dt>
            <dd>{{ sim.patchedCount }} / {{ goal.servers }}</dd>
          </dl>
        </div>
        <div class="card">
          <h4>Last 60 seconds</h4>
          <div class="strip">
            <i v-for="(cls, i) in strip()" :key="i" :class="cls"></i>
          </div>
          <small
            >Green served everything, red dropped requests, hatched had nothing
            able to serve.</small
          >
        </div>
        <div class="card">
          <h4>Event log</h4>
          <ul class="log">
            <li v-for="(entry, i) in sim.log" :key="sim.log.length - i">
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
/* the site tokens: card surfaces, hairline borders, radius 0. ok, bad and
   request are the only colours that are not neutral. */
.pul {
  --ok: var(--success);
  --bad: var(--error);
  --request: var(--warning);
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
.pul *,
.pul *::before,
.pul *::after {
  box-sizing: border-box;
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
  max-width: 62ch;
  color: var(--muted);
  text-wrap: pretty;
}
.goal {
  margin: 8px 0 0;
  color: var(--body);
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

/* ----- parts bar (level 2) ----- */
.parts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  background: var(--card);
}
.parts-label,
.hint {
  color: var(--muted);
  font-size: 14px;
}

/* ----- stage + side ----- */
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 16px;
}
.stage {
  position: relative;
  min-height: clamp(540px, 72vh, 700px);
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
  justify-content: space-between;
  align-items: center;
  gap: 56px;
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
.stage > div {
  position: relative;
  z-index: 2;
}

.users {
  background: var(--fg);
  color: var(--bg);
  padding: 10px 14px 12px;
  width: min(300px, 84vw);
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
  background: var(--request);
  border-color: var(--request);
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
  accent-color: var(--request);
  margin: 0;
}

.lbzone {
  width: min(360px, 94%);
}
.drop {
  border: 2px dashed var(--muted);
  padding: 18px;
  text-align: center;
  color: var(--muted);
}
.lb {
  background: var(--bg);
  border: 2px solid var(--accent);
  padding: 10px 14px;
}
.lb .row {
  align-items: baseline;
  gap: 8px;
}
.lb small {
  color: var(--muted);
}
.name {
  font-weight: 600;
}
.pool {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.pool span {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border: 1.5px solid var(--ok);
  color: var(--ok);
}
.pool span.out {
  border-color: var(--muted);
  color: var(--muted);
  border-style: dashed;
}
.pool span.sick {
  border-color: var(--bad);
  color: var(--bad);
}

.servers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  width: 100%;
}
/* share the row: up to four cards, each between 150 and 230 wide */
.server {
  flex: 1 1 150px;
  max-width: 230px;
  min-width: 0;
  background: var(--bg);
  border: 2px solid var(--ok);
  padding: 8px 10px;
}
.server button {
  padding: 6px 8px;
  font-size: 13px;
}
.server.offline {
  border-color: var(--bad);
  border-style: dashed;
}
.server.out:not(.offline) {
  border-color: var(--muted);
}
.server .row {
  gap: 6px;
  flex-wrap: wrap;
}
.ver {
  color: var(--muted);
  font-weight: 500;
  margin-left: 6px;
  font-size: 14px;
  font-family: var(--font-mono);
}
.pill {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  background: var(--ok);
  color: var(--bg);
}
.offline .pill {
  background: var(--bad);
}
.out:not(.offline) .pill {
  background: var(--muted);
}
.slots {
  display: flex;
  gap: 5px;
  margin: 8px 0 2px;
}
.slot {
  width: 15px;
  height: 15px;
  border: 1.5px solid var(--border-strong);
}
.slot.busy {
  background: var(--ok);
  border-color: var(--ok);
}
.cap {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
  font-family: var(--font-mono);
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
  height: 5px;
  background: var(--border);
  margin-top: 8px;
  overflow: hidden;
  visibility: hidden;
}
.offline .bar {
  visibility: visible;
}
.bar i {
  display: block;
  height: 100%;
  background: var(--bad);
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
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px 24px;
}
.result-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.result-note {
  display: block;
  margin-top: 4px;
  font-size: 15px;
  font-weight: 400;
  color: var(--muted);
  white-space: normal;
}
.result.quiet {
  grid-template-columns: minmax(0, 1fr) auto;
}
.result dl {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px 20px;
  margin: 0;
}
.result dt {
  color: var(--muted);
  margin-right: 6px;
}
.result dd.bad {
  color: var(--bad);
}
.done .stage {
  border-color: var(--fg);
}

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
.log {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  max-height: 200px;
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

@media (max-width: 860px) {
  .pul {
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
