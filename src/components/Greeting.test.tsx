import React from "react";
import { describe, it, expect } from "vitest";
import Greeting from "./Greeting";
import { render } from "@testing-library/react";

describe("Greeting", () => {
  it("renders a greeting", () => {
    const { container } = render(<Greeting name="John" isLoggedIn={true} />);
    expect(container.textContent).toContain("Greeting John");
  });
  it("renders  login", () => {
    const { container } = render(<Greeting name="John" isLoggedIn={false} />);
    expect(container.textContent).toContain("Please login");
  });
});
