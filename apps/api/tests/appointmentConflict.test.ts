import { describe, expect, it } from "vitest";
import { findConflict, rangesOverlap } from "../src/domain/appointmentConflict.js";

function at(hour: number, minute = 0): Date {
  return new Date(2026, 0, 1, hour, minute);
}

describe("rangesOverlap", () => {
  it("detects a full overlap", () => {
    expect(rangesOverlap({ startTime: at(9), endTime: at(10) }, { startTime: at(9), endTime: at(10) })).toBe(
      true
    );
  });

  it("detects a partial overlap on either side", () => {
    expect(rangesOverlap({ startTime: at(9), endTime: at(10) }, { startTime: at(9, 30), endTime: at(11) })).toBe(
      true
    );
    expect(rangesOverlap({ startTime: at(9, 30), endTime: at(11) }, { startTime: at(9), endTime: at(10) })).toBe(
      true
    );
  });

  it("treats back-to-back appointments as non-overlapping", () => {
    expect(rangesOverlap({ startTime: at(9), endTime: at(10) }, { startTime: at(10), endTime: at(11) })).toBe(
      false
    );
  });

  it("does not flag ranges that don't touch", () => {
    expect(rangesOverlap({ startTime: at(9), endTime: at(10) }, { startTime: at(14), endTime: at(15) })).toBe(
      false
    );
  });
});

describe("findConflict", () => {
  const existing = [
    { id: "a", startTime: at(9), endTime: at(10) },
    { id: "b", startTime: at(13), endTime: at(14) },
  ];

  it("returns the conflicting appointment when one overlaps", () => {
    const conflict = findConflict({ startTime: at(9, 30), endTime: at(10, 30) }, existing);
    expect(conflict?.id).toBe("a");
  });

  it("returns undefined when the slot is free", () => {
    const conflict = findConflict({ startTime: at(11), endTime: at(12) }, existing);
    expect(conflict).toBeUndefined();
  });
});
