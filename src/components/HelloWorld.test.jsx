import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HelloWorld from "./HelloWorld.jsx";
import { name, work } from "./test.js";

describe("HelloWorld", () => {
  it("renders author info and message", () => {
    render(<HelloWorld msg="你好，世界！" />);

    expect(
      screen.getByText(`${name} · ${work}`, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "你好，世界！"
    );
  });

  it("increments the counter on click", async () => {
    const user = userEvent.setup();
    render(<HelloWorld msg="click test" />);

    const button = screen.getByRole("button", { name: /计数/i });
    expect(button).toHaveTextContent("0");

    await user.click(button);
    await user.click(button);

    expect(button).toHaveTextContent("2");
  });
});

