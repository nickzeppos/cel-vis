import { FederalScorecardView } from "@/components/federal/FederalScorecardView";
import FederalTableView from "@/components/federal/FederalTableView";
import { useEffect } from "react";
// import PerformanceView from "./components/performance/PerformanceView";
import { StateScorecardView } from "./components/state/StateScorecardView";
import StateTableView from "./components/state/StateTableView";
import { TableStateProvider, useTableState } from "./context/TableStateContext";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// force scroll to top on route change
// to handle high number row click => scorecard transition
// i.e., when user is scrolled sufficiently far down on a table view, clicks a row, the
// we have to send a message to the iframe parent div to scroll to the top, otherwise user encounters
// black space under scorecard where the table once was, and has to manually scroll up
function ScrollToTop() {
  // pathname = path portion of current url
  const { pathname } = useLocation();

  // scroll to top whenever pathname changes
  // just as with our updateHeight effect, we have to communicate this to parent
  // b/c app is embedded via iframe from github page to WP site
  useEffect(() => {
    // scroll within iframe to NW corner in overflow cases
    window.scrollTo(0, 0);

    // tell parent to scroll to top
    if (window.parent) {
      window.parent.postMessage({ type: "scrollToTop" }, "*");
    }
  }, [pathname]);

  return null;
}

// Create a router that handles height updates on route changes
function AppRouter() {
  const { updateHeight } = useTableState();

  // Update height when component first mounts
  useEffect(() => {
    updateHeight();

    // Also update height on route changes
    const handleRouteChange = () => {
      // Use requestAnimationFrame to wait for render
      requestAnimationFrame(() => {
        updateHeight();
      });
    };

    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [updateHeight]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Default route redirects to federal table */}
        <Route path="/" element={<Navigate to="/federal/table" replace />} />

        {/* Federal routes */}
        <Route path="/federal/table" element={<FederalTableView />} />
        <Route
          path="/federal/scorecard/:bioguideId"
          element={<FederalScorecardView />}
        />

        {/* State routes */}
        <Route path="/state/table" element={<StateTableView />} />
        <Route
          path="/state/scorecard/:state/:slesId"
          element={<StateScorecardView />}
        />

        {/* Performance view */}
        {/* <Route path="/performance/:bioguideId" element={<PerformanceView />} /> */}

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/federal/table" replace />} />
      </Routes>
    </BrowserRouter>
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
