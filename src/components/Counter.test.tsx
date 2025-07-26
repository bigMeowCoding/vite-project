import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import Counter from "./Counter";
import { render, waitFor, fireEvent, cleanup } from "@testing-library/react";

describe("Counter", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a counter", () => {
    const { container } = render(<Counter />);
    expect(container.textContent).toContain("Count: 0");
  });

  it("测试 increment 按钮点击", async () => {
    const { container, getByTestId } = render(<Counter />);
    const incrementButton = getByTestId("increment-button");

    fireEvent.click(incrementButton);

    await waitFor(() => {
      expect(container.textContent).toContain("Count: 1");
    });
  });

  it("测试 decrement 按钮点击", async () => {
    const { container, getByTestId } = render(<Counter />);
    const decrementButton = getByTestId("decrement-button");

    fireEvent.click(decrementButton);

    await waitFor(() => {
      expect(container.textContent).toContain("Count: -1");
    });
  });

  it("测试多次点击 increment 按钮", async () => {
    const { container, getByTestId } = render(<Counter />);
    const incrementButton = getByTestId("increment-button");

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    await waitFor(() => {
      expect(container.textContent).toContain("Count: 3");
    });
  });

  it("测试 increment 和 decrement 按钮组合使用", async () => {
    const { container, getByTestId } = render(<Counter />);
    const incrementButton = getByTestId("increment-button");
    const decrementButton = getByTestId("decrement-button");

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    await waitFor(() => {
      expect(container.textContent).toContain("Count: 1");
    });
  });
});
