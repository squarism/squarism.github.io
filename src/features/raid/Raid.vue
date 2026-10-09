<script setup lang="ts">
// the raid feature: pick 1+0 or 0+1, then fail disks at random until the
// array is lost. the model lives in sim.ts. it is wrapped in reactive(), not
// shallowReactive() like downtime: there is no frame loop here re-rendering
// everything, so the template needs the failed list and runs tracked. the
// state is eight disks, so deep tracking costs nothing.
import { onMounted, onUnmounted, reactive, ref } from "vue";
import SimFrame from "@/features/ui/SimFrame.vue";
import SimSide from "@/features/ui/SimSide.vue";
import SimCard from "@/features/ui/SimCard.vue";
import SimStat from "@/features/ui/SimStat.vue";
import SimResult from "@/features/ui/SimResult.vue";
import SimBar from "@/features/ui/SimBar.vue";
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
const root = ref<InstanceType<typeof SimFrame> | null>(null);

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
    return {
      name: groupName(sim.layout, g),
      cls: !up ? "down" : hit ? "degraded" : "",
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

function stateLabel(state: DiskState): string {
  if (state === "ok") return "Serving";
  if (state === "offline") return "Idle";
  return "Failed";
}

function risk(): "ok" | "warn" | "bad" {
  if (sim.lost || sim.chance >= 0.5) return "bad";
  if (sim.chance >= 0.2) return "warn";
  return "ok";
}

function statusTone(): "ok" | "warn" | "bad" {
  if (sim.status === "Lost") return "bad";
  if (sim.status === "Degraded") return "warn";
  return "ok";
}

function hint(): string {
  if (sim.lost) return "Rebuild, or switch layouts and try the other one.";
  if (sim.failed.length === 0) {
    return "Pick a layout, then fail a disk. Watch which disks turn fatal after the first one.";
  }
  return `${sim.fatal.length} of ${sim.healthy.length} disks are fatal now. Fail another and see.`;
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

// space fails a disk and R rebuilds while the sim is on screen, no click
// needed. skipped with a modifier (cmd+r still reloads) or while typing in
// a field
let visible = false;
let observer: IntersectionObserver | null = null;

function onKey(e: KeyboardEvent): void {
  if (!visible) return;
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
  const t = e.target;
  if (
    t instanceof HTMLElement &&
    (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName))
  )
    return;
  if (e.key === " ") {
    e.preventDefault();
    roll();
  } else if (e.key.toLowerCase() === "r") {
    restart();
  }
}

onMounted(() => {
  observer = new IntersectionObserver(entries => {
    for (const e of entries) visible = e.isIntersecting;
  });
  if (root.value?.$el instanceof Element) observer.observe(root.value.$el);
  window.addEventListener("keydown", onKey);
});

onUnmounted(() => {
  window.clearTimeout(timer);
  observer?.disconnect();
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <SimFrame
    ref="root"
    class="raid"
    title="RAID 1+0 vs 0+1"
    subtitle="Which layout survives more failures?"
    :done="sim.lost"
    restart-key="r"
    @restart="restart"
  >
    <SimBar label="Layout" :hint="LAYOUTS[sim.layout].summary">
      <div class="sim-seg" role="group" aria-label="Layout">
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
      </div>
    </SimBar>

    <div class="sim-grid">
      <section class="sim-stage stage" aria-label="Simulation">
        <div class="nas-head">
          <span class="sim-label">nas-01</span>
          <span class="sim-pill" :class="statusTone()">
            <i class="sim-dot" :class="statusTone()"></i>{{ sim.status }}
          </span>
        </div>

        <div class="groups" :class="sim.layout === '1+0' ? 'pairs' : 'sets'">
          <div v-for="g in groups()" :key="g.name" class="group" :class="g.cls">
            <div class="sim-label group-name">{{ g.name }}</div>
            <!-- the rail on the left ties the disks of a mirror or a stripe
                 together. it goes amber when one is hurt and red dashed when
                 the group is gone -->
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
                <span class="disk-state">
                  <i
                    class="sim-dot"
                    :class="{
                      bad: d.state === 'failed',
                      off: d.state === 'offline',
                    }"
                  ></i>
                  {{ stateLabel(d.state) }}
                </span>
                <span class="disk-chance" :title="`chance ${d.name} is next`">
                  {{ d.chance }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="legend">
          <span class="legend-chip" aria-hidden="true">d?</span>
          A red outline means the array is lost if that disk dies next.
        </div>

        <div class="controls">
          <button
            type="button"
            class="primary"
            :aria-disabled="sim.lost || rolling !== null"
            aria-keyshortcuts="Space"
            @click="roll"
          >
            {{ rolling !== null ? "Rolling…" : "Fail a random disk" }}
            <kbd class="sim-kbd">space</kbd>
          </button>
          <p class="sim-note">{{ hint() }}</p>
        </div>

        <SimResult
          v-if="sim.lost"
          class="result"
          tone="bad"
          :title="`Array lost after ${sim.failed.length} ${sim.failed.length === 1 ? 'failure' : 'failures'}`"
          :note="resultNote()"
        >
          <button type="button" aria-keyshortcuts="r" @click="restart">
            Rebuild <kbd class="sim-kbd">R</kbd>
          </button>
        </SimResult>
      </section>

      <SimSide>
        <SimStat
          :value="sim.lost ? 'Lost' : pct(sim.chance)"
          :tone="risk()"
          label="chance the next failure loses the array"
        >
          <dl>
            <dt>Disks failed</dt>
            <dd>{{ sim.failed.length }} / {{ DISKS }}</dd>
            <dt>Still serving</dt>
            <dd>{{ sim.serving }}</dd>
            <dt>Fatal next</dt>
            <dd :class="{ bad: sim.fatal.length > 0 }">
              {{ sim.fatal.length }} of {{ sim.healthy.length }}
            </dd>
          </dl>
        </SimStat>
        <SimCard
          title="Your runs"
          meta="avg failures survived"
          note="Run each layout a few times. 0+1 rarely gets past two."
        >
          <dl>
            <template v-for="l in LAYOUT_ORDER" :key="l">
              <dt>{{ LAYOUTS[l].title }}</dt>
              <dd>
                {{ sim.runCount(l) }} <span class="x">×</span> {{ average(l) }}
              </dd>
            </template>
          </dl>
        </SimCard>
      </SimSide>
    </div>
  </SimFrame>
</template>

<style scoped>
.stage {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 28px 28px;
}

.nas-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

/* 1+0 is four pairs side by side; 0+1 is two sets of four */
.groups {
  display: grid;
  gap: 20px;
}
.groups.pairs {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.groups.sets {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.group {
  --rail: var(--ok);
  min-width: 0;
}
.group.degraded {
  --rail: var(--warn);
}
.group.down {
  --rail: var(--bad);
}
.group-name {
  margin-bottom: 12px;
}

/* the rail: a vertical line down the left, a tick into each disk */
.disks {
  position: relative;
  display: grid;
  gap: 12px;
  padding-left: 14px;
}
.disks::before {
  content: "";
  position: absolute;
  left: 0;
  top: 22px;
  bottom: 22px;
  border-left: 2px solid var(--rail);
}
.group.down .disks::before {
  border-left-style: dashed;
}
.disk::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 50%;
  width: 12px;
  border-top: 2px solid var(--rail);
}
.group.down .disk::before {
  border-top-style: dashed;
}

/* one drive bay: name on top, state and odds under */
.disk {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "name name"
    "state chance";
  gap: 10px 8px;
  padding: 14px 16px;
  border: 1px solid var(--border-strong);
  clip-path: var(--sim-corner);
  background: var(--bg);
  font-size: 15px;
  transition:
    border-color 0.12s,
    background 0.12s,
    opacity 0.12s;
}
.disk-name {
  grid-area: name;
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  color: var(--fg);
}
.disk-state {
  grid-area: state;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--body);
}
.disk-chance {
  grid-area: chance;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.disk.fatal {
  border-color: var(--bad);
  box-shadow: inset 0 0 0 1px var(--bad);
}
.disk.offline {
  opacity: 0.5;
}
.disk.failed {
  border-style: dashed;
  border-color: var(--bad);
  background: var(--bad-dim);
  box-shadow: none;
}
.disk.failed .disk-state {
  color: var(--bad);
}
.disk.rolling {
  border-color: var(--fg);
  background: var(--fg);
  color: var(--bg);
  opacity: 1;
}
.disk.rolling .disk-name,
.disk.rolling .disk-state,
.disk.rolling .disk-chance {
  color: var(--bg);
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

/* the legend chip is a tiny disk, so it reads as "a disk like this" and
   not as a checkbox */
.legend {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--muted);
}
.legend-chip {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid var(--bad);
  box-shadow: inset 0 0 0 1px var(--bad);
  clip-path: var(--sim-corner);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--fg);
  background: var(--bg);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 28px;
  margin-top: auto;
}
.controls .primary {
  padding: 14px 20px;
  font-size: 16px;
  flex: none;
}
.controls .sim-note {
  flex: 1 1 280px;
}

.result {
  grid-template-columns: minmax(0, 1fr) auto;
}
.x {
  color: var(--muted);
  margin: 0 4px;
}

@media (max-width: 860px) {
  .stage {
    padding: 18px;
  }
  .groups.pairs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 520px) {
  .groups.sets {
    grid-template-columns: 1fr;
  }
}
</style>
