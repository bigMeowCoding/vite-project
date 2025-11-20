import { useState } from "react";
import { name, work } from "./test.js";

export default function HelloWorld({ msg }) {
  const [count, setCount] = useState(0);

  return (
    <section className="card">
      <p>
        {name} · {work}
      </p>
      <h2>{msg}</h2>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        计数：{count}
      </button>
      <p>
        编辑 <code>components/HelloWorld.jsx</code> 体验热更新
      </p>

      <p>
        React 官方文档：
        <a href="https://react.dev/learn" target="_blank" rel="noreferrer">
          react.dev
        </a>
      </p>
      <p>
        推荐 IDE：VS Code，安装 React 相关插件可提升效率。
      </p>
      <p className="read-the-docs">点击按钮即可计数</p>
    </section>
  );
}


