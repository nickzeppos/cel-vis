import { FederalScorecardView } from "@/components/federal/FederalScorecardView";
import FederalTableView from "@/components/federal/FederalTableView";
import type { ViewRoute } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import PerformanceView from "./components/performance/PerformanceView";
import { StateScorecardView } from "./components/state/StateScorecardView";
import StateTableView from "./components/state/StateTableView";
import { TableStateProvider, useTableState } from "./context/TableStateContext";

const defaultRoute = { type: "federal:table" } as ViewRoute;
// const defaultRoute = {
//   type: "perf",
//   bioguideID: "P000197",
//   congress: 118,
// } as ViewRoute;

// Create a router that handles height updates on route changes
function AppRouter() {
  const [route, setRoute] = useState<ViewRoute>(defaultRoute);
  const { updateHeight } = useTableState();

  // Handle route changes with height updates
  const handleRouteChange = useCallback(
    (newRoute: ViewRoute) => {
      setRoute(newRoute);
      // Use requestAnimationFrame to wait for render
      requestAnimationFrame(() => {
        updateHeight();
      });
    },
    [updateHeight]
  );

  // Also update height when component first mounts
  useEffect(() => {
    updateHeight();
  }, [updateHeight]);

  return (
    <>
      {(() => {
        switch (route.type) {
          case "federal:table":
            return (
              <FederalTableView route={route} setRoute={handleRouteChange} />
            );
          case "federal:scorecard":
            return (
              <FederalScorecardView
                legislator={route.legislator}
                onBack={() => handleRouteChange({ type: "federal:table" })}
              />
            );
          case "state:table":
            return (
              <StateTableView route={route} setRoute={handleRouteChange} />
            );
          case "state:scorecard":
            return (
              <StateScorecardView
                legislator={route.legislator}
                onBack={() => handleRouteChange({ type: "state:table" })}
              />
            );
          case "perf":
            return (
              <PerformanceView
                bioguideID={route.bioguideID}
                congress={route.congress}
              />
            );
        }
      })()}
    </>
  );
}

function App() {
  return (
    <TableStateProvider>
      <AppRouter />
    </TableStateProvider>
  );
}

export default App;
