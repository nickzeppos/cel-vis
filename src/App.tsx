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
    // Function to send height to parent
    const sendHeightToParent = () => {
      const height = document.body.scrollHeight;
      if (window.parent) {
        window.parent.postMessage(
          {
            type: "setHeight",
            height: height,
          },
          "*" // TODO: control target origin w/ env
        );
      }
    };

    // Send height when component mounts
    sendHeightToParent();

    // Send height when window resizes
    window.addEventListener("resize", sendHeightToParent);

    // Optional: Send height when content changes
    // You might need to call this function after data loads or UI updates

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
