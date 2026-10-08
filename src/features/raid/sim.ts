// raid 1+0 vs 0+1 on an eight disk nas: the model, with no dom in it. the vue
// component renders it; tests/features drives it with a fixed random.
//
// 1+0 mirrors pairs of disks, then stripes across the four pairs. it is lost
// when both disks of any one pair are dead.
// 0+1 stripes two sets of four, then mirrors the two sets. one dead disk takes
// its whole set offline, so it is lost once both sets have a dead disk in them.

export const DISKS = 8;

export type Layout = "1+0" | "0+1";
export const LAYOUT_ORDER: Layout[] = ["1+0", "0+1"];

export interface LayoutInfo {
  title: string;
  summary: string;
  // what each group of disks is
  inner: "mirror" | "stripe";
  groups: number[][];
}

export const LAYOUTS: Record<Layout, LayoutInfo> = {
  "1+0": {
    title: "RAID 1+0",
    summary: "Four mirrored pairs, striped together.",
    inner: "mirror",
    groups: [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
    ],
  },
  "0+1": {
    title: "RAID 0+1",
    summary: "Two stripes of four disks, mirrored.",
    inner: "stripe",
    groups: [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ],
  },
};

export type DiskState = "ok" | "failed" | "offline";

// one finished run: the layout and how many failures it survived
export interface Run {
  layout: Layout;
  survived: number;
}

export interface SimOptions {
  layout?: Layout;
  random?: () => number;
}

export function diskName(i: number): string {
  return `d${i + 1}`;
}

export function groupName(layout: Layout, g: number): string {
  return `${LAYOUTS[layout].inner} ${"ABCD"[g]}`;
}

export function groupOf(layout: Layout, disk: number): number {
  return LAYOUTS[layout].groups.findIndex(g => g.includes(disk));
}

export function otherLayout(layout: Layout): Layout {
  return layout === "1+0" ? "0+1" : "1+0";
}

// a mirror works while one of its disks does; a stripe needs every disk
export function groupUp(
  layout: Layout,
  g: number,
  failed: ReadonlySet<number>
): boolean {
  const disks = LAYOUTS[layout].groups[g];
  return LAYOUTS[layout].inner === "mirror"
    ? disks.some(d => !failed.has(d))
    : disks.every(d => !failed.has(d));
}

// stripes of mirrors need every mirror; a mirror of stripes needs one stripe
export function arrayUp(layout: Layout, failed: ReadonlySet<number>): boolean {
  const ups = LAYOUTS[layout].groups.map((_, g) => groupUp(layout, g, failed));
  return LAYOUTS[layout].inner === "mirror"
    ? ups.every(Boolean)
    : ups.some(Boolean);
}

export function healthyDisks(failed: ReadonlySet<number>): number[] {
  return Array.from({ length: DISKS }, (_, i) => i).filter(i => !failed.has(i));
}

// disks that have not failed but would lose the array if they did. none once
// the array is already lost
export function fatalDisks(
  layout: Layout,
  failed: ReadonlySet<number>
): number[] {
  if (!arrayUp(layout, failed)) return [];
  return healthyDisks(failed).filter(
    i => !arrayUp(layout, new Set([...failed, i]))
  );
}

// chance the next failure, equally likely to be any disk still spinning,
// loses the array. 1 once it is lost
export function lossChance(
  layout: Layout,
  failed: ReadonlySet<number>
): number {
  if (!arrayUp(layout, failed)) return 1;
  const healthy = healthyDisks(failed);
  if (healthy.length === 0) return 1;
  return fatalDisks(layout, failed).length / healthy.length;
}

// how many failures from the start of the sequence a layout lives through.
// the whole length when it is never lost
export function survivedFailures(layout: Layout, sequence: number[]): number {
  const failed = new Set<number>();
  for (const [i, d] of sequence.entries()) {
    failed.add(d);
    if (!arrayUp(layout, failed)) return i;
  }
  return sequence.length;
}

// failed is failed. in 0+1 a good disk in a dead stripe is offline: it still
// spins but the array stopped reading from it
export function diskState(
  layout: Layout,
  disk: number,
  failed: ReadonlySet<number>
): DiskState {
  if (failed.has(disk)) return "failed";
  if (LAYOUTS[layout].inner === "stripe") {
    if (!groupUp(layout, groupOf(layout, disk), failed)) return "offline";
  }
  return "ok";
}

export class Sim {
  layout: Layout;
  // disk numbers in the order they failed
  failed: number[] = [];
  runs: Run[] = [];
  private readonly random: () => number;

  constructor(opts: SimOptions = {}) {
    this.layout = opts.layout ?? "1+0";
    this.random = opts.random ?? Math.random;
    this.restart();
  }

  get failedSet(): Set<number> {
    return new Set(this.failed);
  }

  get up(): boolean {
    return arrayUp(this.layout, this.failedSet);
  }

  get lost(): boolean {
    return !this.up;
  }

  get healthy(): number[] {
    return healthyDisks(this.failedSet);
  }

  get fatal(): number[] {
    return fatalDisks(this.layout, this.failedSet);
  }

  get chance(): number {
    return lossChance(this.layout, this.failedSet);
  }

  // disks the array is actually reading from
  get serving(): number {
    const failed = this.failedSet;
    if (this.lost) return 0;
    return this.healthy.filter(d => diskState(this.layout, d, failed) === "ok")
      .length;
  }

  get status(): "Healthy" | "Degraded" | "Lost" {
    if (this.lost) return "Lost";
    return this.failed.length ? "Degraded" : "Healthy";
  }

  // the layout is the decision: it locks once a disk has failed and frees up
  // again when the array is lost. switching starts a fresh array
  get canSwitch(): boolean {
    return this.failed.length === 0 || this.lost;
  }

  setLayout(layout: Layout): void {
    if (!this.canSwitch || layout === this.layout) return;
    this.layout = layout;
    this.restart();
  }

  restart(): void {
    this.failed = [];
  }

  // the next disk to fail, any healthy one equally likely. null when lost
  pickRandom(): number | null {
    if (this.lost) return null;
    const healthy = this.healthy;
    return healthy[Math.floor(this.random() * healthy.length)] ?? null;
  }

  fail(disk: number): void {
    if (this.lost || this.failed.includes(disk)) return;
    if (disk < 0 || disk >= DISKS) return;
    this.failed.push(disk);
    if (this.lost) {
      this.runs.push({ layout: this.layout, survived: this.failed.length - 1 });
    }
  }

  failRandom(): number | null {
    const disk = this.pickRandom();
    if (disk !== null) this.fail(disk);
    return disk;
  }

  // what the other layout would have done with these failures, in this order
  get otherSurvived(): number {
    return survivedFailures(otherLayout(this.layout), this.failed);
  }

  // average failures survived over the finished runs of a layout, or null
  average(layout: Layout): number | null {
    const runs = this.runs.filter(r => r.layout === layout);
    if (!runs.length) return null;
    return runs.reduce((sum, r) => sum + r.survived, 0) / runs.length;
  }

  runCount(layout: Layout): number {
    return this.runs.filter(r => r.layout === layout).length;
  }
}
