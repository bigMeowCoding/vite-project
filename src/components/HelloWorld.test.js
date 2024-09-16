import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import HelloWorld from "./HelloWorld.vue"; // 假设组件路径是相对于测试文件的

describe("HelloWorld.vue", () => {
  it("renders the correct message from props", () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: "Hello Vitest!",
      },
    });
    // 测试 h1 是否正确显示传递的 `msg` 值
    expect(wrapper.find("h1").text()).toBe("Hello Vitest!");
  });

  it("increments the count when button is clicked", async () => {
    const wrapper = mount(HelloWorld);
    const button = wrapper.find("button");

    // 点击按钮前，count 初始值应该是 0
    expect(button.text()).toContain("count is 0");

    // 点击按钮后，count 增加
    await button.trigger("click");
    expect(button.text()).toContain("count is 1");
  });

  it("renders static HTML elements", () => {
    const wrapper = mount(HelloWorld);

    // 测试是否包含一些静态文本
    expect(wrapper.html()).toContain("编辑");
    expect(wrapper.html()).toContain("Volar");
  });
});
