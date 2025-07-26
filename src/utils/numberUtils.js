export function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    return NaN;
  }
  return a + b;
}

export function isEven(number) {
  return number % 2 === 0;
}
