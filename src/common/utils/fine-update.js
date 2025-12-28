const effectStack = [];
export function useEffect(callback) {
  const execute = () => {
    cleanup(effect);
    try {
      effectStack.push(effect);
      callback();
    } finally {
      effectStack.pop();
    }
  };

  const effect = {
    execute,
    deps: new Set(),
  };
  execute();
}

function cleanup(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.clear();
}

export function useState(value) {
  const subs = new Set();
  const getValue = () => {
    const effect = effectStack[effectStack.length - 1];
    effect && subscribe(effect, subs);
    return value;
  };
  const setValue = (newValue) => {
    value = newValue;
    [...subs].forEach((sub) => sub.execute());
  };
  return [getValue, setValue];
}

function subscribe(effect, subs) {
  subs.add(effect);
  effect.deps.add(subs);
}

export function useMemo(callback) {
  const [getValue, setValue] = useState();

  useEffect(() => {
    setValue(callback());
  });

  return getValue;
}
