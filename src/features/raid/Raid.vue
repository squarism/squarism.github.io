<script setup lang="ts">
// the raid feature: pick 1+0 or 0+1, then fail disks at random until the
// array is lost. the model lives in sim.ts. it is wrapped in reactive(), not
// shallowReactive() like downtime: there is no frame loop here re-rendering
// everything, so the template needs the failed list and runs tracked. the
// state is eight disks, so deep tracking costs nothing.
import { onMounted, onUnmounted, reactive, ref } from "vue";
import {
  DISKS,
  LAYOUTS,
  LAYOUT_ORDER,
  Sim,
  diskName,
  diskState,
  groupName,
  groupUp,
  otherLayout,
  type DiskState,
  type Layout,
} from "./sim";

const sim = reactive(new Sim()) as Sim;
const root = ref<HTMLElement | null>(null);

// the disk the roulette is passing over, null when not rolling
const rolling = ref<number | null>(null);
// the disk that just died, for the shake. cleared on the next roll
const justFailed = ref<number | null>(null);
let timer = 0;

/* ---------- views ---------- */

interface DiskView {
  i: number;
  name: string;
  state: DiskState;
  fatal: boolean;
  chance: string;
}

interface GroupView {
  name: string;
  status: string;
  cls: string;
  disks: DiskView[];
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function groups(): GroupView[] {
  const failed = sim.failedSet;
  const fatal = new Set(sim.fatal);
  const healthy = sim.healthy.length;
  const info = LAYOUTS[sim.layout];
  return info.groups.map((disks, g) => {
    const up = groupUp(sim.layout, g, failed);
    const hit = disks.some(d => failed.has(d));
    let status = "OK";
    let cls = "";
    if (!up) {
      status = info.inner === "mirror" ? "Lost" : "Offline";
      cls = "down";
    } else if (hit) {
      status = "Degraded";
      cls = "degraded";
    }
    return {
      name: groupName(sim.layout, g),
      status,
      cls,
      disks: disks.map(i => {
        const state = diskState(sim.layout, i, failed);
        return {
          i,
          name: diskName(i),
          state,
          fatal: fatal.has(i),
          chance: state === "failed" || sim.lost ? "" : pct(1 / healthy),
        };
      }),
    };
  });
}

function risk(): string {
  if (sim.lost) return "bad";
  if (sim.chance >= 0.5) return "bad";
  if (sim.chance >= 0.2) return "warn";
  return "ok";
}

function resultNote(): string {
  const other = LAYOUTS[otherLayout(sim.layout)].title;
  const n = sim.failed.length;
  const kept = sim.otherSurvived;
  if (kept === n) {
    return `With the same ${n} failures in the same order, ${other} would still be running.`;
  }
  if (kept === n - 1) {
    return `With the same failures in the same order, ${other} would have been lost on the same disk.`;
  }
  return `With the same failures in the same order, ${other} would have been lost sooner, after surviving ${kept}.`;
}

function average(layout: Layout): string {
  const avg = sim.average(layout);
  return avg === null ? "–" : avg.toFixed(1);
}

/* ---------- controls ---------- */

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// pick the disk up front, then hop a highlight over the healthy disks,
// slowing down, and land on it. the hops are only for show
function roll(): void {
  const target = sim.pickRandom();
  if (target === null || rolling.value !== null) return;
  justFailed.value = null;
  if (reducedMotion()) {
    land(target);
    return;
  }
  const healthy = sim.healthy;
  const hops = 12;
  let step = 0;
  const hop = () => {
    step++;
    if (step >= hops) {
      land(target);
      return;
    }
    const others = healthy.filter(d => d !== rolling.value);
    rolling.value = others[Math.floor(Math.random() * others.length)];
    timer = window.setTimeout(hop, 40 + step * step * 1.6);
  };
  hop();
}

function land(disk: number): void {
  rolling.value = null;
  sim.fail(disk);
  justFailed.value = disk;
}

function restart(): void {
  window.clearTimeout(timer);
  rolling.value = null;
  justFailed.value = null;
  sim.restart();
}

function pick(layout: Layout): void {
  if (rolling.value !== null) return;
  justFailed.value = null;
  sim.setLayout(layout);
}

// R rebuilds while the sim is on screen, no click needed. skipped with a
// modifier (cmd+r still reloads) or while typing in a field
let visible = false;
let observer: IntersectionObserver | null = null;

function onKey(e: KeyboardEvent): void {
  if (!visible || e.key.toLowerCase() !== "r") return;
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
  const t = e.target;
  if (
    t instanceof HTMLElement &&
    (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
  )
    return;
  restart();
}

onMounted(() => {
  observer = new IntersectionObserver(entries => {
    for (const e of entries) visible = e.isIntersecting;
  });
  if (root.value) observer.observe(root.value);
  window.addEventListener("keydown", onKey);
});

onUnmounted(() => {
  window.clearTimeout(timer);
  observer?.disconnect();
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <div
    class="feature-wide raid not-prose"
    :class="{ done: sim.lost }"
    ref="root"
  >
    <header class="head">
      <div>
        <h3 class="title">RAID 1+0 vs 0+1 Sim</h3>
        <p class="goal">
          <span class="goal-label">Goal</span> Pick the layout that survives
          more failures. Try each a few times and watch the odds.
        </p>
      </div>
      <button type="button" aria-keyshortcuts="r" @click="restart">
        Restart
      </button>
    </header>

    <div class="parts">
      <span class="parts-label">Layout</span>
      <button
        v-for="l in LAYOUT_ORDER"
        :key="l"
        type="button"
        :class="{ on: sim.layout === l }"
        :disabled="(!sim.canSwitch && sim.layout !== l) || rolling !== null"
        :aria-pressed="sim.layout === l"
        @click="pick(l)"
      >
        {{ LAYOUTS[l].title }}
      </button>
      <span class="hint">{{
        sim.canSwitch
          ? LAYOUTS[sim.layout].summary
          : "Locked in until the array is lost or you restart."
      }}</span>
    </div>

    <div class="grid">
      <section class="stage" aria-label="Simulation">
        <div class="nas">
          <div class="nas-head">
            <span class="name">nas-01</span>
            <span class="pill" :class="sim.status.toLowerCase()">{{
              sim.status
            }}</span>
          </div>

          <div class="groups" :class="sim.layout === '1+0' ? 'pairs' : 'sets'">
            <div
              v-for="g in groups()"
              :key="g.name"
              class="group"
              :class="g.cls"
            >
              <div class="group-head">
                <span>{{ g.name }}</span>
                <small>{{ g.status }}</small>
              </div>
              <div class="disks">
                <div
                  v-for="d in g.disks"
                  :key="d.i"
                  class="disk"
                  :class="[
                    d.state,
                    {
                      fatal: d.fatal,
                      rolling: rolling === d.i,
                      hit: justFailed === d.i,
                    },
                  ]"
                >
                  <span class="disk-name">{{ d.name }}</span>
                  <span class="led" aria-hidden="true"></span>
                  <span class="disk-state">{{
                    d.state === "ok"
                      ? "Serving"
                      : d.state === "offline"
                        ? "Idle"
                        : "Failed"
                  }}</span>
                  <span
                    class="disk-chance"
                    :title="`chance ${d.name} is next`"
                    >{{ d.chance }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="controls">
          <button
            type="button"
            class="primary"
            :aria-disabled="sim.lost || rolling !== null"
            @click="roll"
          >
            {{ rolling !== null ? "Rolling…" : "Fail a random disk" }}
          </button>
          <span class="legend">
            <i class="key fatal"></i> fails the array if it dies next
          </span>
        </div>

        <div v-if="sim.lost" class="result" role="status">
          <div class="result-title">
            Array lost after {{ sim.failed.length }}
            {{ sim.failed.length === 1 ? "failure" : "failures" }}
            <span class="result-note">{{ resultNote() }}</span>
          </div>
          <button type="button" aria-keyshortcuts="r" @click="restart">
            Rebuild
          </button>
        </div>
      </section>

      <aside class="side">
        <div class="card big">
          <div class="num" :class="risk()">
            {{ sim.lost ? "Lost" : pct(sim.chance) }}
          </div>
          <div>chance the next failure loses the array</div>
        </div>
        <div class="card">
          <dl>
            <dt>Layout</dt>
            <dd>{{ LAYOUTS[sim.layout].title }}</dd>
            <dt>Disks failed</dt>
            <dd>{{ sim.failed.length }} / {{ DISKS }}</dd>
            <dt>Disks serving</dt>
            <dd>{{ sim.serving }}</dd>
            <dt>Fatal next</dt>
            <dd>{{ sim.fatal.length }} of {{ sim.healthy.length }}</dd>
          </dl>
        </div>
        <div class="card">
          <h4>Your runs</h4>
          <dl class="runs">
            <template v-for="l in LAYOUT_ORDER" :key="l">
              <dt>{{ LAYOUTS[l].title }}</dt>
              <dd>
                {{ sim.runCount(l) }}
                {{ sim.runCount(l) === 1 ? "run" : "runs" }},
                {{ average(l) }} avg
              </dd>
            </template>
          </dl>
          <small
            >Average failures survived before the array was lost. To reset,
            refresh the page.</small
          >
        </div>
        <div class="card">
          <small class="keys">Press <kbd>R</kbd> to rebuild.</small>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* same frame as the other features: site tokens, hairline borders, radius 0.
   ok, warn and bad are the only colours that are not neutral. */
.raid {
  --ok: var(--success);
  --bad: var(--error);
  --warn: var(--warning);
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
.raid *,
.raid *::before,
.raid *::after {
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
button:hover:not(:disabled, [aria-disabled="true"]) {
  background: var(--fg);
  color: var(--bg);
}
/* aria-disabled looks the same but keeps focus, so the fail button can be
   pressed again with space after a roll or a rebuild */
button:disabled,
button[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
}
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
button.primary,
button.on {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
}
button.primary:hover:not(:disabled, [aria-disabled="true"]),
button.on:hover:not(:disabled) {
  filter: brightness(1.12);
  background: var(--accent);
  color: var(--on-accent);
}
button.on:disabled {
  opacity: 1;
}

/* ----- layout bar ----- */
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
  min-height: 520px;
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
  gap: 32px;
  padding: 24px 14px;
}

.nas {
  width: min(760px, 100%);
  background: var(--bg);
  border: 2px solid var(--fg);
  padding: 12px 14px 14px;
}
.done .nas {
  border-color: var(--bad);
}
.nas-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.name {
  font-weight: 600;
}
.pill {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  background: var(--ok);
  color: var(--bg);
}
.pill.degraded {
  background: var(--warn);
  color: #111;
}
.pill.lost {
  background: var(--bad);
}

/* 1+0 is four pairs side by side; 0+1 is two sets of four */
.groups {
  display: grid;
  gap: 10px;
}
.groups.pairs {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.groups.sets {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.group {
  border: 1.5px solid var(--ok);
  padding: 8px;
}
.group.degraded {
  border-color: var(--warn);
}
.group.down {
  border-color: var(--bad);
  border-style: dashed;
}
.group-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
}
.group-head small {
  font-weight: 500;
  color: var(--muted);
  text-transform: none;
}
.disks {
  display: grid;
  gap: 6px;
}
.sets .disks {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* one drive bay: name and led on top, state and odds under */
.disk {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2px 8px;
  padding: 8px 10px;
  border: 2px solid var(--border-strong);
  background: var(--card);
  font-size: 13px;
  transition:
    border-color 0.12s,
    background 0.12s;
}
.disk-name {
  font-family: var(--font-mono);
  font-weight: 600;
}
.led {
  align-self: center;
  width: 8px;
  height: 8px;
  background: var(--ok);
}
.disk-state {
  color: var(--muted);
  font-size: 12px;
}
.disk-chance {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.disk.fatal {
  border-color: var(--bad);
}
.disk.offline {
  opacity: 0.55;
  border-style: dashed;
}
.disk.offline .led {
  background: var(--muted);
}
.disk.failed {
  border-color: var(--bad);
  border-style: dashed;
  background: transparent;
}
.disk.failed .led {
  background: var(--bad);
}
.disk.failed .disk-state {
  color: var(--bad);
  font-weight: 600;
}
.disk.rolling {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent);
  opacity: 1;
}
.disk.rolling .disk-state,
.disk.rolling .disk-chance {
  color: var(--on-accent);
}
.disk.hit {
  animation: shake 0.35s ease-out;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(2px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .disk.hit {
    animation: none;
  }
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px 20px;
  margin-bottom: auto;
}
.controls .primary {
  padding: 10px 18px;
  font-size: 15px;
}
.legend {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
}
.key {
  width: 14px;
  height: 14px;
  border: 2px solid var(--bad);
}

/* ----- array lost ----- */
.result {
  position: absolute;
  inset: auto 14px 14px 14px;
  z-index: 3;
  background: var(--bg);
  border: 2px solid var(--bad);
  padding: 16px 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px 24px;
}
.result-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--bad);
}
.result-note {
  display: block;
  margin-top: 4px;
  font-size: 15px;
  font-weight: 400;
  color: var(--muted);
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
  font-variant-numeric: tabular-nums;
}
.num.ok {
  color: var(--ok);
}
.num.warn {
  color: var(--warn);
}
.num.bad {
  color: var(--bad);
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
.card .keys {
  margin: 0;
}
kbd {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 1px 5px;
  border: 1px solid var(--border-strong);
}
.runs {
  margin-top: 8px;
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

@media (max-width: 860px) {
  .raid {
    padding: 16px;
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .groups.pairs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .result {
    position: static;
    grid-template-columns: 1fr;
    width: 100%;
  }
}
@media (max-width: 520px) {
  .groups.sets {
    grid-template-columns: 1fr;
  }
}
</style>
