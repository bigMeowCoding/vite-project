import { render, screen, within } from "@testing-library/react";
import App from "./App.jsx";

describe("App", () => {
  it("shows heading and table data", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "React 示例页面" })
    ).toBeInTheDocument();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // 1 header row + 5 data rows
    expect(rows).toHaveLength(6);
    expect(within(rows[1]).getByText("Tom")).toBeVisible();
  });
});

