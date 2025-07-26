import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button data-testid="increment-button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button data-testid="decrement-button" onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <p>Count: {count}</p>
    </div>
  );
}
