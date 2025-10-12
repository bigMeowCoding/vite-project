let obj = { a: 1 };
const sum = (a, b) => a + b;

const b = obj.a;
const a = obj.a + 1;
console.log('sum:', sum(2, 3), 'b:', b, 'a:', a);

// 深层属性读取（提供 mock 数据并使用）
const user = { address: { city: 'Shanghai' } };
const city = user.address.city;
console.log('city:', city);

const data = { items: [{ name: 'Item1' }] };
const itemName = data['items'][0].name;
console.log('itemName:', itemName);

// 方法调用与链式访问（提供 mock api 并使用）
const api = {
  getUser() {
    return { name: 'Alice' };
  },
};
const result1 = api.getUser().name;
console.log('result1:', result1);

// 为调用场景准备可调用成员 b
obj.a = {
  b() {
    return 'ok';
  },
};
const result2 = obj.a.b();
console.log('result2:', result2);

// this 链式访问与方法调用（提供上下文并使用）
function testThis() {
  return this.state.user.profile.getName();
}
const testThisResult = testThis.call({
  state: {
    user: {
      profile: {
        getName() {
          return 'Name';
        },
      },
    },
  },
});
console.log('testThisResult:', testThisResult);

// call/apply 调用（提供 fn 与 ctx）
function fn(x) {
  return x;
}
const ctx = { val: 123 };
console.log('fn.call:', fn.call(ctx, 1));
console.log('fn.apply:', fn.apply(ctx, [1, 2]));

// 赋值与更新（应跳过可选链）
obj.a = 2;
obj.a++;

// 构造调用（不应处理为可选链）
new obj.Ctor();
// 解构
const { o1, ...ret } = obj;
const [o2, ...rest] = a1;
a = { ...ret };
a = [...rest];
