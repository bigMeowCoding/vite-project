import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

function Home() {
  return <div>Home 页面</div>;
}

function About() {
  return <div>About 页面</div>;
}

export default function App() {
  const [disabled, setDisabled] = React.useState(window.__disable_popstate__ ?? false);
  const [popCount, setPopCount] = React.useState(0);

  React.useEffect(() => {
    window.__disable_popstate__ = disabled;
  }, [disabled]);

  React.useEffect(() => {
    const onPop = () => setPopCount((c) => c + 1);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>React Router popstate 拦截验证</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => setDisabled((v) => !v)}>
          {disabled ? '启用 popstate' : '禁用 popstate'}
        </button>
        <span style={{ fontSize: 12, color: '#666' }}>
          popstate 拦截开关：{String(disabled)}
        </span>
        <span style={{ fontSize: 12, color: '#666' }}>
          当前路径：{window.location.pathname}
        </span>
        <span style={{ fontSize: 12, color: '#666' }}>
          popstate 命中次数：{popCount}
        </span>
      </div>

      <nav style={{ marginBottom: 12 }}>
        <Link to="/" style={{ marginRight: 8 }}>Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <div style={{ marginBottom: 12, fontSize: 12, color: '#666' }}>
        验证步骤：
        <ol>
          <li>禁用 popstate 后，点击上面的链接仍会正常跳转（React Router 使用 pushState 触发内部更新）。</li>
          <li>禁用 popstate 后，使用浏览器后退/前进，页面将不再响应（因为 React Router 依赖 popstate 监听 back/forward）。</li>
          <li>启用 popstate 后，后退/前进恢复正常，同时上方“popstate 命中次数”会增加。</li>
        </ol>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}