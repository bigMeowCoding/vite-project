import { describe, it, expect } from 'vitest';
import { transformCode } from '../../safe-chain-cli.js';

function runTransform(source) {
  const { code } = transformCode(source, 'inline.js');
  return code;
}

describe('safe-chain: optional chaining and fallbacks', () => {
  it('adds optional chaining for nested member access', () => {
    const input = `const b = obj.a; const c = obj.a.b;`;
    const out = runTransform(input);
    expect(out).toMatch(/obj\?\.a/);
    expect(out).toMatch(/obj\?\.a\?\.b/);
  });

  it('adds optional call for method invocation', () => {
    const input = `const r = api.getUser();`;
    const out = runTransform(input);
    expect(out).toContain('api?.getUser?.()');
  });

  it('skips new expression callee', () => {
    const input = `new obj.Ctor();`;
    const out = runTransform(input);
    expect(out).toContain('new obj.Ctor()');
    expect(out).not.toContain('new obj?.Ctor()');
  });

  it('skips assignment target and update expressions', () => {
    const input = `obj.a = 1; obj.a++; ++obj.a;`;
    const out = runTransform(input);
    expect(out).toContain('obj.a = 1');
    expect(out).toContain('obj.a++');
    expect(out).toContain('++obj.a');
    expect(out).not.toMatch(/obj\?\.a\s=|obj\?\.a\+\+|\+\+obj\?\.a/);
  });

  it('adds destructuring RHS fallbacks for objects', () => {
    const input = `const { o1, ...ret } = obj;`;
    const out = runTransform(input);
    expect(out).toMatch(/const\s*\{[\s\S]*o1,[\s\S]*\.\.\.ret[\s\S]*\}\s*=\s*obj\s*\|\|\s*\{\s*\}/);
  });

  it('adds destructuring RHS fallbacks for arrays', () => {
    const input = `const [a, ...rest] = list;`;
    const out = runTransform(input);
    expect(out).toMatch(/const\s*\[\s*a,\s*\.\.\.rest\s*\]\s*=\s*list\s*\|\|\s*\[\s*\]/);
  });

  it('adds spread fallbacks in object literals', () => {
    const input = `const a = { ...ret };`;
    const out = runTransform(input);
    expect(out).toMatch(/\{\s*\.\.\.\(\s*ret\s*\|\|\s*\{\s*\}\s*\)\s*\}/);
  });

  it('adds spread fallbacks in array literals', () => {
    const input = `const a = [ ...rest ];`;
    const out = runTransform(input);
    expect(out).toMatch(/\[\s*\.\.\.\(\s*rest\s*\|\|\s*\[\s*\]\s*\)\s*\]/);
  });

  it('respects global objects and this/super skips', () => {
    const input = `console.log('x'); this.method(); super();`;
    const out = runTransform(input);
    expect(out).toContain("console.log('x')");
    expect(out).toContain('this.method()');
    expect(out).toContain('super()');
  });
});
