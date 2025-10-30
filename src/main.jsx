import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { installPopstateIsolation } from './isolation.js';

const rootEl = document.getElementById('root');
// 在 React Router 注册 popstate 监听之前安装拦截
installPopstateIsolation();
createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);