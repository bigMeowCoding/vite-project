import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter.jsx";

describe("Counter 组件", () => {
  test("初始状态下显示计数 0", () => {
    render(<Counter />);
    expect(screen.getByRole("button")).toHaveTextContent("计数：0");
  });

  test("点击按钮，计数会递增", async () => {
    render(<Counter />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(button).toHaveTextContent("计数：1");
    await userEvent.click(button);
    expect(button).toHaveTextContent("计数：2");
  });
});
