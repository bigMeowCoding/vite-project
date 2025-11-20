import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        计数：{count}
      </button>
    </div>
  );
}
