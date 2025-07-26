import { describe, it, expect } from "vitest";
import { add, isEven } from "./numberUtils";

describe("numberUtils", () => {
  it("正常运算", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(2, -3)).toBe(-1);
    expect(isEven(4)).toBe(true);
    expect(isEven(1)).toBe(false);
  });

  it("类型不正确情况", () => {
    expect(add(2, "3")).toBe(Number.NaN);
    expect(isEven("b")).toBe(false);
  });
});
