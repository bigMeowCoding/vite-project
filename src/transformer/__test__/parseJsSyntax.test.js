import { describe, expect, test } from "vitest";
import { paseJsSyntax } from "../extractAndReplaceChineseInVue";

describe("paseJsSyntax Function Tests", () => {
  // 测试普通字符串输入
  test("should handle normal string input without change", () => {
    const input = "const name = '周义竣'";
    const output = paseJsSyntax(input);
    expect(output).toBe("const name = $t('周义竣')");
  });

  // 测试对象字面量输入
  test("should correctly parse object structure input", () => {
    const input = `{ key: 'value' };`;
    const expectedOutput = `{ key: 'value' }`;
    const output = paseJsSyntax(input);
    expect(output).equal(expectedOutput);
  });

  // 测试含有分号的输入，验证是否正确去除末尾的换行符
  test("should remove trailing newline if present", () => {
    const input = 'console.log("Hello, World!")\n';
    const expectedOutput = 'console.log("Hello, World!")';
    const output = paseJsSyntax(input);
    expect(output).toBe(expectedOutput);
  });

  // 添加更多边缘情况和复杂场景的测试...
});

// 确保在 package.json 中有运行测试的脚本，如：
// "scripts": {
//   "test": "vitest"
// }
