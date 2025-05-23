import { describe, expect, it } from "vitest";
import { delay } from "../store/timer.js";

describe.only("dd", () => {
  it("sss", () => {
    let a = 1;
    expect(a).toBe(1);
  });
});
it.only("测试delay延迟1s", async () => {
  const start = Date.now();
  try {
    await delay(1000);
  } catch (error) {
    console.log("delay函数抛出异常: " + error.message);
  }
  const end = Date.now();
  const diff = end - start;
  expect(diff).toBeGreaterThanOrEqual(990);
  expect(diff).toBeLessThanOrEqual(1500); // 更宽松的上限
});
