import { describe, it, expect, vi } from "vitest";
import { useState, useEffect } from "./fine-update";

describe("fine-update", () => {
  it("useState should return initial value and setter", () => {
    const [getCount, setCount] = useState(0);
    expect(getCount()).toBe(0);
    setCount(1);
    expect(getCount()).toBe(1);
  });

  it("useEffect should run immediately", () => {
    const fn = vi.fn();
    useEffect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("useEffect should subscribe to state changes", () => {
    const [getCount, setCount] = useState(0);
    const fn = vi.fn(() => {
      getCount();
    });

    useEffect(fn);
    expect(fn).toHaveBeenCalledTimes(1);

    setCount(1);
    expect(fn).toHaveBeenCalledTimes(2);
    // getCount is called inside fn, so it should be 1 now
    expect(getCount()).toBe(1);
  });

  it("useEffect should handle multiple state dependencies", () => {
    const [getCount, setCount] = useState(0);
    const [getName, setName] = useState("alice");

    const fn = vi.fn(() => {
      getCount();
      getName();
    });

    useEffect(fn);
    expect(fn).toHaveBeenCalledTimes(1);

    setCount(1);
    expect(fn).toHaveBeenCalledTimes(2);

    setName("bob");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("useEffect should not run if state is not accessed", () => {
    const [getCount, setCount] = useState(0);
    const fn = vi.fn(); // Doesn't call getCount

    useEffect(fn);
    expect(fn).toHaveBeenCalledTimes(1);

    setCount(1);
    expect(fn).toHaveBeenCalledTimes(1); // Should not trigger update
  });

  it("independent effects should not interfere", () => {
    const [getCount, setCount] = useState(0);
    const fn1 = vi.fn(() => getCount());
    const fn2 = vi.fn(() => getCount());

    useEffect(fn1);
    useEffect(fn2);

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    setCount(1);

    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
  });
});
