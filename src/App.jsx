import Greeting from "./components/Greeting";
import Counter from "./components/Counter";

const App = () => {
  return (
    <div>
      <Greeting name="John" />
      <Counter />
    </div>
  );
};

export default App;
