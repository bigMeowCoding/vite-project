import Counter from "./components/Counter.jsx";
import { useEffect, useMemo, useState } from "./common/utils/fine-update.js";

export default function App() {
  const [name1, setName1] = useState("lilei");
  const [name2, setName2] = useState("hanmeimei");
  const [showAll, toggleShowAll] = useState(false);
  const whoIsHere = useMemo(() => {
    return showAll() ? `${name1()} and ${name2()}` : name1();
  });

  useEffect(() => {
    console.log("showAll changed", whoIsHere());
  });

  return (
    <div>
      <button type="button" onClick={() => toggleShowAll(!showAll)}>
        {showAll() ? "Show All" : "Show less"}
      </button>
      sdf
    </div>
  );
}
