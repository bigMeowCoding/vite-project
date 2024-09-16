import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import axios from "axios";
import StudentLIst from "./StudentLIst.vue";
import ElementPlus from "element-plus";

// 模拟 axios
vi.mock("axios");

describe("StudentTable.vue", () => {
  beforeEach(() => {
    // 每个测试前都重置 mock
    vi.clearAllMocks();
  });

  it("renders table with student data", async () => {
    // 模拟 API 响应
    axios.get.mockResolvedValue({
      data: {
        students: [
          { name: "Alice", age: 20, major: "Physics" },
          { name: "Bob", age: 22, major: "Mathematics" },
        ],
        total: 10,
      },
    });

    const wrapper = mount(StudentLIst, {
      global: {
        plugins: [ElementPlus],
      },
    });

    // 等待异步数据加载完成
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0)); // 确保所有异步更新完成

    // 验证表格内容
    const rows = wrapper.findAll("tr");
    expect(rows.length).toBe(3); // 1 行标题 + 2 行数据
    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).toContain("Bob");
  });

  it("handles page change correctly", async () => {
    // 模拟 API 响应
    axios.get.mockResolvedValue({
      data: {
        students: [{ name: "Charlie", age: 23, major: "Chemistry" }],
        total: 10,
      },
    });

    const wrapper = mount(StudentLIst, {
      global: {
        plugins: [ElementPlus],
      },
    });

    // 触发分页变化
    await wrapper
      .findComponent({ ref: "pagination" })
      .vm.$emit("current-change", 2);

    // 等待异步数据加载完成
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0)); // 确保所有异步更新完成

    // 验证数据变化
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/students", {
      params: { page: 2, pageSize: 5 },
    });
    expect(wrapper.text()).toContain("Charlie");
  });
});
