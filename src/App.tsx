import type { ViewRoute } from "@/lib/types";
import { useState, useEffect } from "react";
import FederalTableView from "@/components/federal/FederalTableView";
import { FederalScorecardView } from "@/components/federal/FederalScorecardView";
import StateTableView from "./components/state/StateTableView";
import { StateScorecardView } from "./components/state/StateScorecardView";

const defaultRoute = { type: "federal:table" } as ViewRoute;
function App() {
  const [route, setRoute] = useState<ViewRoute>(defaultRoute);

  useEffect(() => {
    const sendHeightToParent = () => {
      const height = document.documentElement.scrollHeight;
      console.log("[iframe] Sending height:", height);
      if (window.parent) {
        window.parent.postMessage(
          {
            type: "setHeight",
            height: height,
          },
          "*"
        );
      }
    };
    sendHeightToParent();
    window.addEventListener("resize", sendHeightToParent); // listen for resizes
    return () => {
      window.removeEventListener("resize", sendHeightToParent);
    };
  }, []);

  // switch render on route
  switch (route.type) {
    case "federal:table":
      return <FederalTableView route={route} setRoute={setRoute} />;
    case "federal:scorecard":
      return (
        <FederalScorecardView
          legislator={route.legislator}
          onBack={() => setRoute({ type: "federal:table" })}
        />
      );
    case "state:table":
      return <StateTableView route={route} setRoute={setRoute} />;
    case "state:scorecard":
      return (
        <StateScorecardView
          legislator={route.legislator}
          onBack={() => setRoute({ type: "state:table" })}
        />
      );
  }
}

export default App;
