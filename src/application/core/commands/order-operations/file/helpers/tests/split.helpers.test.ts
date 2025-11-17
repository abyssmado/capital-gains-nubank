import {
  handleEscape,
  handleStringToggle,
  updateDepth,
  shouldFlush,
  flushRemaining,
} from "../split.helpers";

describe("split.helpers", () => {
  test("handleEscape toggles escape state", () => {
    let esc = false;
    const start = () => (esc = true);
    const end = () => (esc = false);
    expect(handleEscape("\\", start, end, esc)).toBe(true);
    esc = true;
    expect(handleEscape("a", start, end, esc)).toBe(true);
  });

  test("handleStringToggle toggles on double quote", () => {
    let v = false;
    expect(handleStringToggle('"', () => (v = !v))).toBe(true);
  });

  test("updateDepth and shouldFlush behavior", () => {
    expect(updateDepth("[", 0)).toBe(1);
    expect(updateDepth("]", 1)).toBe(0);
    expect(shouldFlush(0, " [1]")).toBe(true);
  });

  test("flushRemaining calls callback for non-empty", () => {
    const calls: string[] = [];
    flushRemaining("  data ", (v) => calls.push(v));
    expect(calls).toEqual(["data"]);
  });
});
