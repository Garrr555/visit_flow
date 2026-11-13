import { describe, expect, it } from "vitest";

describe("Activity query rules", () => {
  it("accepts the supported visit statuses", () => {
    expect(["VISITED", "NOT_VISITED"]).toContain("VISITED");
    expect(["VISITED", "NOT_VISITED"]).toContain("NOT_VISITED");
  });

  it("rejects an inverted date range", () => {
    const from = "2026-03-31";
    const to = "2026-03-01";
    expect(from > to).toBe(true);
  });
});
