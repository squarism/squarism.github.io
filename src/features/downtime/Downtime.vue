<script setup lang="ts">
// one stage of the downtime feature. level 1 is the single server,
// level 2 adds parts (servers, a load balancer). the sim lives in sim.ts and
// is wrapped in shallowReactive() so the template reads it directly. shallow
// on purpose: the frame counter below changes every frame, which re-renders
// the template, and the template reads the nested server state fresh each time.
// deep reactivity would track every request moving every frame for nothing.
// this file adds the canvas (request paths, effects) and the controls.
import { onMounted, onUnmounted, ref, shallowReactive } from "vue";
import SimFrame from "@/features/ui/SimFrame.vue";
import SimSide from "@/features/ui/SimSide.vue";
import SimCard from "@/features/ui/SimCard.vue";
import SimStat from "@/features/ui/SimStat.vue";
import SimResult from "@/features/ui/SimResult.vue";
import SimStrip from "@/features/ui/SimStrip.vue";
import SimLog from "@/features/ui/SimLog.vue";
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

const root = ref<InstanceType<typeof SimFrame> | null>(null);
const stage = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const usersBox = ref<HTMLElement | null>(null);
const lbCard = ref<HTMLElement | null>(null);
// the slot the balancer goes in, drawn as the track even while empty
const lbZone = ref<HTMLElement | null>(null);
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

function resultTitle(): string {
  const at = fmtClock(sim.t);
  if (sim.quiet) return `Patched at ${at}`;
  if (sim.clean) return `Goal reached at ${at}`;
  return `Patched with downtime at ${at}`;
}

function resultNote(): string | undefined {
  if (sim.quiet) {
    return "You patched successfully, but there were no users. Start the traffic and try again.";
  }
  if (sim.clean) return undefined;
  if (props.level === 1) {
    return "The patch is on, but users were turned away while the server was offline. With a single server this is unavoidable. The next scenario fixes it.";
  }
  return "The patch is on, but requests were dropped. Drain a server before patching it and try again.";
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
let zoneBox: Box | null = null;
const serverBoxes = new Map<string, Box>();
let raf = 0;
let last = 0;
// bumped every frame and read on the stage element. that read is what makes
// this component re-render per frame: the sim is shallow, so a server going
// offline in place changes nothing it tracks. the clock in the side column
// is slot content and is tracked by the card, not by this template
const frame = ref(0);
let observer: IntersectionObserver | null = null;

function readColors(): void {
  const el = root.value?.$el;
  if (!(el instanceof HTMLElement)) return;
  const cs = getComputedStyle(el);
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
  zoneBox = lbZone.value ? rel(lbZone.value) : null;
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
  // the track: users down to the balancer slot, then on to the servers.
  // faint, so the requests riding it stand out
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = colors.muted;
  ctx.globalAlpha = 0.35;
  const hub = lbBox ?? zoneBox;
  ctx.beginPath();
  if (hub) {
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(hub.x, hub.top);
  }
  if (!lbBox) {
    const from = hub ? { x: hub.x, y: hub.bottom } : source;
    const first = sim.servers[0] && serverBoxes.get(sim.servers[0].name);
    if (first) {
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(first.x, first.top);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
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
  if (++frame.value % 60 === 0) readColors();
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
  <SimFrame
    ref="root"
    class="pul"
    :title="title"
    :subtitle="goal.text"
    :done="sim.done"
    @restart="restart"
  >
    <div class="sim-grid">
      <section
        ref="stage"
        class="sim-stage stage"
        aria-label="Simulation"
        :data-frame="frame"
      >
        <canvas ref="canvas"></canvas>

        <div v-if="level === 2" class="parts">
          <span class="sim-label">Parts</span>
          <div class="parts-btns">
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
          </div>
        </div>

        <div ref="usersBox" class="users">
          <div class="users-head">
            <span class="mono">users</span>
            <span class="state">
              <i class="sim-dot" :class="sim.traffic ? 'live' : 'off'"></i>
              {{ sim.traffic ? "Live" : "Idle" }}
            </span>
          </div>
          <label class="rate">
            <span>Rate</span>
            <input
              v-model.number="rate"
              type="range"
              min="1"
              :max="MAX_RATE"
              :disabled="sim.done"
              @input="onRate"
            />
            <span class="mono"
              ><b>{{ rate }}</b> req/s</span
            >
          </label>
          <button
            type="button"
            class="primary wide"
            :class="{ live: sim.traffic }"
            :disabled="sim.done"
            @click="toggleTraffic"
          >
            {{ sim.traffic ? "Stop traffic" : "Start traffic" }}
          </button>
        </div>

        <div v-if="level === 2" ref="lbZone" class="lbzone">
          <div v-if="!sim.lb" class="drop">
            no load balancer — traffic goes straight to
            {{ sim.servers[0]?.name }}
          </div>
          <div v-else ref="lbCard" class="lb">
            <div class="users-head">
              <span class="mono">lb-01</span>
              <small>round robin, health check every {{ HEALTH_SECS }} s</small>
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
            <div class="server-head">
              <span class="mono name">{{ v.server.name }}</span>
            </div>
            <div class="server-row">
              <span class="state">
                <i
                  class="sim-dot"
                  :class="{
                    bad: !v.server.online,
                    off: v.server.online && (v.out || v.idle),
                  }"
                ></i>
                {{ v.status }}
              </span>
              <span class="mono ver">v1.0.{{ v.server.patch }}</span>
            </div>
            <div class="slots" aria-hidden="true">
              <i
                v-for="j in WORKERS"
                :key="j"
                class="slot"
                :class="{ busy: v.server.online && j <= v.server.jobs.length }"
              ></i>
            </div>
            <div class="bar"><i :style="{ width: v.patchPct + '%' }"></i></div>
            <div class="mono cap">
              served {{ v.server.served.toLocaleString() }}
            </div>
            <button
              type="button"
              class="wide"
              :disabled="!v.server.online || sim.done || sim.upToDate(v.server)"
              @click="sim.startPatch(v.server)"
            >
              {{ v.patchLabel }}
            </button>
            <div v-if="level === 2" class="btn-row">
              <button
                v-if="sim.lb"
                type="button"
                class="wide"
                :disabled="sim.done"
                @click="sim.toggleDrain(v.server)"
              >
                {{ v.server.inPool ? "Drain" : "Return" }}
              </button>
              <button
                type="button"
                class="quiet wide"
                :disabled="!sim.canRemoveServer(v.server)"
                @click="sim.removeServer(v.server)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <p class="sim-note">{{ hint() }}</p>

        <SimResult
          v-if="sim.done"
          :title="resultTitle()"
          :note="resultNote()"
          :tone="sim.quiet ? undefined : sim.clean ? 'ok' : 'bad'"
          :stack="!sim.quiet && !sim.clean"
        >
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
        </SimResult>
      </section>

      <SimSide>
        <SimStat :value="sim.dropped.toLocaleString()" label="requests dropped">
          <dl>
            <dt>Clock</dt>
            <dd>{{ fmtClock(sim.t) }}</dd>
            <dt>Handled</dt>
            <dd>{{ sim.handled.toLocaleString() }}</dd>
            <dt>Availability</dt>
            <dd>{{ availability() }}</dd>
            <dt>Downtime</dt>
            <dd :class="{ bad: sim.downtime > 0 }">
              {{ sim.downtime.toFixed(1) }} s
            </dd>
            <dt>Patched</dt>
            <dd>{{ sim.patchedCount }} / {{ goal.servers }}</dd>
          </dl>
        </SimStat>
        <SimCard title="Last 60 s" note="Hatched: nothing could serve.">
          <SimStrip :cells="strip()" />
        </SimCard>
        <SimCard title="Event log">
          <SimLog :entries="sim.log" :clock="fmtClock" />
        </SimCard>
      </SimSide>
    </div>
  </SimFrame>
</template>

<style scoped>
/* requests ride the track in amber. everything else is the shared theme */
.pul {
  --request: var(--warning);
}

.stage {
  min-height: clamp(560px, 74vh, 760px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 24px 28px 28px;
}
.mono {
  font-family: var(--font-mono);
}
.state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--body);
}
.sim-dot.live {
  background: var(--request);
}

/* ----- parts, top right of the stage ----- */
.parts {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: -8px;
}
.parts-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* ----- the users box ----- */
.users {
  width: min(440px, 100%);
  background: var(--bg);
  border: 1px solid var(--border-strong);
  clip-path: var(--sim-corner);
  padding: 16px 18px 18px;
  display: grid;
  gap: 12px;
}
.users-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}
.users-head .mono {
  font-size: 16px;
  font-weight: 600;
}
.users-head small {
  color: var(--muted);
  font-size: 13px;
}
.rate {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  color: var(--body);
}
.rate input[type="range"] {
  width: 100%;
  accent-color: var(--fg);
  margin: 0;
}
.rate b {
  color: var(--fg);
  font-weight: 600;
}
button.wide {
  width: 100%;
  justify-content: center;
}
.users .live,
.users .live:hover {
  background: var(--request);
  border-color: var(--request);
  color: #111;
}

/* ----- the balancer slot ----- */
.lbzone {
  width: min(440px, 100%);
}
.drop {
  border: 1px dashed var(--border-strong);
  clip-path: var(--sim-corner);
  padding: 18px;
  text-align: center;
  color: var(--muted);
}
.lb {
  background: var(--bg);
  border: 1px solid var(--fg);
  clip-path: var(--sim-corner);
  padding: 14px 18px;
}
.pool {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.pool span {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 3px 9px;
  border: 1px solid var(--ok);
  clip-path: var(--sim-corner);
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

/* ----- servers share one row: up to four cards, 170 to 250 wide ----- */
.servers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  width: 100%;
}
.server {
  flex: 1 1 170px;
  max-width: 250px;
  min-width: 0;
  background: var(--bg);
  border: 1px solid var(--ok);
  clip-path: var(--sim-corner);
  padding: 12px 14px 14px;
  display: grid;
  gap: 8px;
}
.server.offline {
  border-color: var(--bad);
  border-style: dashed;
}
.server.out:not(.offline) {
  border-color: var(--border-strong);
}
.server-head .name {
  font-size: 15px;
  font-weight: 600;
}
.server-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.ver {
  color: var(--muted);
  font-size: 13px;
}
.slots {
  display: flex;
  gap: 6px;
}
.slot {
  flex: 1;
  height: 6px;
  clip-path: var(--sim-corner);
  background: var(--border);
}
.slot.busy {
  background: var(--ok);
}
.cap {
  font-size: 12px;
  color: var(--muted);
}
.server button {
  padding: 7px 10px;
  font-size: 13px;
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
  clip-path: var(--sim-corner);
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

.stage .sim-note {
  width: 100%;
  margin-top: auto;
}

@media (max-width: 860px) {
  .stage {
    padding: 18px;
    gap: 28px;
  }
}
</style>
