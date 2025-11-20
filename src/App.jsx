import HelloWorld from "./components/HelloWorld.jsx";

const tableData = [
  { id: "12987122", name: "Tom", amount1: "234", amount2: "3.2", amount3: 10 },
  { id: "12987123", name: "Jerry", amount1: "165", amount2: "4.43", amount3: 12 },
  { id: "12987124", name: "Lucy", amount1: "324", amount2: "1.9", amount3: 9 },
  {
    id: "12987125",
    name: "Jonathan",
    amount1: "621",
    amount2: "2.2",
    amount3: 17,
  },
  { id: "12987126", name: "Claire", amount1: "539", amount2: "4.1", amount3: 15 },
];

export default function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>React 示例页面</h1>
        <p>简单的计数器与数据表演示，已移除全部 i18n 逻辑。</p>
      </header>

      <section className="app__content">
        <HelloWorld msg="你好，世界！" />

        <div className="table-card">
          <h2>收支数据</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>姓名</th>
                <th>金额 1</th>
                <th>金额 2</th>
                <th>金额 3</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td title={row.name}>{row.name}</td>
                  <td>{row.amount1}</td>
                  <td>{row.amount2}</td>
                  <td>{row.amount3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
