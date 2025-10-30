// 安装 popstate 拦截：当 window.__disable_popstate__ 为 true 时，拦截所有 popstate 监听器调用
export function installPopstateIsolation() {
  if (window.__popstate_isolation_installed__) return;

  const listenerMap = new WeakMap();
  const originAdd = window.addEventListener;
  const originRemove = window.removeEventListener;

  window.__disable_popstate__ = window.__disable_popstate__ ?? false;

  window.addEventListener = function (type, listener, options) {
    if (type === 'popstate' && typeof listener === 'function') {
      const proxy = function (event) {
        if (!window.__disable_popstate__) {
          listener(event);
        }
      };
      listenerMap.set(listener, proxy);
      return originAdd.call(this, type, proxy, options);
    }
    return originAdd.call(this, type, listener, options);
  };

  window.removeEventListener = function (type, listener, options) {
    if (type === 'popstate' && typeof listener === 'function') {
      const proxy = listenerMap.get(listener);
      if (proxy) listener = proxy;
    }
    return originRemove.call(this, type, listener, options);
  };

  window.__popstate_isolation_installed__ = true;
}