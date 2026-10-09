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
    title="RAID 1+0 vs 0+1 Sim"
    goal="Pick the layout that survives more failures. Try each a few times and watch the odds."
    :done="sim.lost"
    restart-key="r"
    @restart="restart"
  >
    <SimBar
      label="Layout"
      :hint="
        sim.canSwitch
          ? LAYOUTS[sim.layout].summary
          : 'Locked in until the array is lost or you restart.'
      "
    >
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
    </SimBar>

    <div class="sim-grid">
      <section class="sim-stage stage" aria-label="Simulation">
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

        <SimResult
          v-if="sim.lost"
          class="result"
          tone="bad"
          :title="`Array lost after ${sim.failed.length} ${sim.failed.length === 1 ? 'failure' : 'failures'}`"
          :note="resultNote()"
        >
          <button type="button" aria-keyshortcuts="r" @click="restart">
            Rebuild
          </button>
        </SimResult>
      </section>

      <SimSide>
        <SimStat
          :value="sim.lost ? 'Lost' : pct(sim.chance)"
          :tone="risk()"
          label="chance the next failure loses the array"
        />
        <SimCard>
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
        </SimCard>
        <SimCard
          title="Your runs"
          note="Average failures survived before the array was lost. To reset, refresh the page."
        >
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
        </SimCard>
        <SimCard>
          <small class="keys">Press <kbd>R</kbd> to rebuild.</small>
        </SimCard>
      </SimSide>
    </div>
  </SimFrame>
</template>

<style scoped>
/* same frame as the other features: site tokens, hairline borders, radius 0.
   ok, warn and bad are the only colours that are not neutral. */
.raid {
}

/* ----- stage + side ----- */
.stage {
  min-height: 520px;
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

.card .keys {
  margin: 0;
}
kbd {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 1px 5px;
  border: 1px solid var(--border-strong);
}
.result {
  grid-template-columns: minmax(0, 1fr) auto;
}
.runs {
  margin-top: 8px;
}

@media (max-width: 860px) {
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
