import { describe, it, expect } from "vitest";
import wrapLabel from "../utils/wrapLabel.js";

// VTest 测试用例
// VTest 测试用例
describe("wrapLabel Function Tests", () => {
  it("should wrap text correctly for '没有换行的文本'", () => {
    const input = { text: "没有换行的文本", charsPerLine: 4 };
    const expected = "没有换行\n的文本";
    const result = wrapLabel(input.text, input.charsPerLine);
    expect(result).toBe(expected);
  });

  it("should wrap text correctly for '这是一个测试文本'", () => {
    const input = { text: "这是一个测试文本", charsPerLine: 4 };
    const expected = "这是一个\n测试文本";
    const result = wrapLabel(input.text, input.charsPerLine);
    expect(result).toBe(expected);
  });

  it("should wrap text correctly for '长文本应该按照每行四个字符换行'", () => {
    const input = { text: "长文本应该按照每行四个字符换行", charsPerLine: 4 };
    const expected = "长文本应\n该按照每\n行四个字\n符换行";
    const result = wrapLabel(input.text, input.charsPerLine);
    expect(result).toBe(expected);
  });

  it("should handle short text '短文本' without additional wrapping", () => {
    const input = { text: "短文本", charsPerLine: 4 };
    const expected = "短文本";
    const result = wrapLabel(input.text, input.charsPerLine);
    expect(result).toBe(expected);
  });

  it("should handle short text '中文测试' without additional wrapping", () => {
    const input = { text: "中文测试", charsPerLine: 4 };
    const expected = "中文测试";
    const result = wrapLabel(input.text, input.charsPerLine);
    expect(result).toBe(expected);
  });

  it("should wrap text correctly for '一行三个字'", () => {
    const input = { text: "一行三个字", charsPerLine: 3 };
    const expected = "一行三\n个字";
    const result = wrapLabel(input.text, input.charsPerLine);
    expect(result).toBe(expected);
  });

  it("should wrap text correctly for '一行两个字'", () => {
    const input = { text: "一行两个字", charsPerLine: 2 };
    const expected = "一行\n两个\n字";
    const result = wrapLabel(input.text, input.charsPerLine);
    expect(result).toBe(expected);
  });
});
