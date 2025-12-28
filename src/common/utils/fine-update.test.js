import { describe, it, expect, vi } from "vitest";
import { useState, useEffect, useMemo } from "./fine-update";

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

  describe("useMemo", () => {
    it("should return initial value", () => {
      const getMemo = useMemo(() => 10);
      expect(getMemo()).toBe(10);
    });

    it("should update when dependency changes", () => {
      const [getCount, setCount] = useState(1);
      const getDouble = useMemo(() => getCount() * 2);

      expect(getDouble()).toBe(2);
      setCount(2);
      expect(getDouble()).toBe(4);
    });

    it("should notify subscribers when updated", () => {
      const [getCount, setCount] = useState(1);
      const getDouble = useMemo(() => getCount() * 2);
      const fn = vi.fn(() => getDouble());

      useEffect(fn);
      // Initial run
      expect(fn).toHaveBeenCalledTimes(1);

      setCount(2);
      // useMemo updates -> notifies effect
      expect(fn).toHaveBeenCalledTimes(2);
      expect(getDouble()).toBe(4);
    });

    it("should only call factory once initially", () => {
      const spy = vi.fn(() => 10);
      const getMemo = useMemo(spy);
      expect(getMemo()).toBe(10);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
