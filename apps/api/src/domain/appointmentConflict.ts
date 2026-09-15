import { ConflictError } from "./errors.js";

export interface TimeRange {
  startTime: Date;
  endTime: Date;
}

export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime;
}

export function findConflict<T extends TimeRange>(candidate: TimeRange, existing: T[]): T | undefined {
  return existing.find((appointment) => rangesOverlap(candidate, appointment));
}

export class SchedulingConflictError extends ConflictError {
  constructor(conflictingStart: Date, conflictingEnd: Date) {
    super(
      `This staff member already has an appointment from ${conflictingStart.toISOString()} to ${conflictingEnd.toISOString()}`
    );
  }
}
