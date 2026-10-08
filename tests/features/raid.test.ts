import { describe, expect, it } from "vitest";
import {
  DISKS,
  Sim,
  arrayUp,
  diskState,
  fatalDisks,
  lossChance,
  survivedFailures,
} from "@/features/raid/sim";

// a random that always lands on the nth healthy disk
const nth = (n: number, of: number = DISKS) => () => n / of;

describe("arrayUp", () => {
  it("keeps 1+0 up with one disk lost from every mirror", () => {
    expect(arrayUp("1+0", new Set([0, 2, 4, 6]))).toBe(true);
  });

  it("loses 1+0 when both disks of one mirror die", () => {
    expect(arrayUp("1+0", new Set([2, 3]))).toBe(false);
  });

  it("keeps 0+1 up while one stripe is whole", () => {
    expect(arrayUp("0+1", new Set([0, 1, 2, 3]))).toBe(true);
  });

  it("loses 0+1 once both stripes have a dead disk", () => {
    expect(arrayUp("0+1", new Set([0, 7]))).toBe(false);
  });
});

describe("loss chance", () => {
  it("is zero for a healthy array of either layout", () => {
    expect(lossChance("1+0", new Set())).toBe(0);
    expect(lossChance("0+1", new Set())).toBe(0);
  });

  it("is one in seven for 1+0 after a failure: only the partner is fatal", () => {
    expect(fatalDisks("1+0", new Set([0]))).toEqual([1]);
    expect(lossChance("1+0", new Set([0]))).toBeCloseTo(1 / 7);
  });

  it("is four in seven for 0+1 after a failure: the whole other stripe is fatal", () => {
    expect(fatalDisks("0+1", new Set([0]))).toEqual([4, 5, 6, 7]);
    expect(lossChance("0+1", new Set([0]))).toBeCloseTo(4 / 7);
  });

  it("goes up for 0+1 when the next failure lands in the dead stripe", () => {
    expect(lossChance("0+1", new Set([0, 1]))).toBeCloseTo(4 / 6);
  });

  it("is one once the array is lost", () => {
    expect(lossChance("1+0", new Set([0, 1]))).toBe(1);
    expect(fatalDisks("1+0", new Set([0, 1]))).toEqual([]);
  });
});

describe("diskState", () => {
  it("takes good disks in a dead 0+1 stripe offline", () => {
    const failed = new Set([1]);
    expect(diskState("0+1", 1, failed)).toBe("failed");
    expect(diskState("0+1", 0, failed)).toBe("offline");
    expect(diskState("0+1", 4, failed)).toBe("ok");
  });

  it("leaves the partner of a dead 1+0 disk serving", () => {
    expect(diskState("1+0", 0, new Set([1]))).toBe("ok");
  });
});

describe("survivedFailures", () => {
  it("counts failures lived through before the loss", () => {
    expect(survivedFailures("0+1", [0, 4])).toBe(1);
    expect(survivedFailures("1+0", [0, 4])).toBe(2);
  });

  it("is the whole sequence when the layout is never lost", () => {
    expect(survivedFailures("1+0", [0, 2, 4, 6])).toBe(4);
  });
});

describe("Sim", () => {
  it("fails the disk the random lands on", () => {
    const sim = new Sim({ random: nth(3) });
    expect(sim.failRandom()).toBe(3);
    expect(sim.failed).toEqual([3]);
    expect(sim.status).toBe("Degraded");
  });

  it("only picks disks that have not failed", () => {
    const sim = new Sim({ random: nth(0) });
    sim.fail(0);
    expect(sim.pickRandom()).toBe(1);
  });

  it("ignores a disk that already failed", () => {
    const sim = new Sim();
    sim.fail(2);
    sim.fail(2);
    expect(sim.failed).toEqual([2]);
  });

  it("stops failing disks once the array is lost and records the run", () => {
    const sim = new Sim({ layout: "1+0" });
    sim.fail(0);
    sim.fail(1);
    expect(sim.lost).toBe(true);
    expect(sim.failRandom()).toBeNull();
    sim.fail(5);
    expect(sim.failed).toEqual([0, 1]);
    expect(sim.runs).toEqual([{ layout: "1+0", survived: 1 }]);
  });

  it("counts serving disks without the offline 0+1 stripe", () => {
    const sim = new Sim({ layout: "0+1" });
    sim.fail(0);
    expect(sim.serving).toBe(4);
  });

  it("locks the layout during a run and frees it after the loss", () => {
    const sim = new Sim({ layout: "1+0" });
    sim.fail(0);
    sim.setLayout("0+1");
    expect(sim.layout).toBe("1+0");
    sim.fail(1);
    sim.setLayout("0+1");
    expect(sim.layout).toBe("0+1");
    expect(sim.failed).toEqual([]);
  });

  it("says how the other layout would have done with the same failures", () => {
    const sim = new Sim({ layout: "0+1" });
    sim.fail(0);
    sim.fail(4);
    expect(sim.lost).toBe(true);
    expect(sim.otherSurvived).toBe(2);
  });

  it("averages finished runs per layout and keeps them across restarts", () => {
    const sim = new Sim({ layout: "1+0" });
    sim.fail(0);
    sim.fail(1);
    sim.restart();
    sim.fail(0);
    sim.fail(2);
    sim.fail(3);
    expect(sim.average("1+0")).toBe(1.5);
    expect(sim.runCount("1+0")).toBe(2);
    expect(sim.average("0+1")).toBeNull();
  });
});
