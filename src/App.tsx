import { useState } from "react";
import FederalRoot from "@/components/federal/FederalRoot";
import StateRoot from "@/components/state/StateRoot";
import type { ViewLevel } from "@/lib/types";

function App() {
  const [level, setLevel] = useState<ViewLevel>("federal");

  return (
    <>
      {level === "federal" ? (
        <FederalRoot level={level} setLevel={setLevel} />
      ) : (
        <StateRoot level={level} setLevel={setLevel} />
      )}
    </>
  );
}

export default App;
