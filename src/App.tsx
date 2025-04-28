import { FederalScorecardView } from "@/components/federal/FederalScorecardView";
import FederalTableView from "@/components/federal/FederalTableView";
import { useEffect } from "react";
import PerformanceView from "./components/performance/PerformanceView";
import { StateScorecardView } from "./components/state/StateScorecardView";
import StateTableView from "./components/state/StateTableView";
import { TableStateProvider, useTableState } from "./context/TableStateContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [updateHeight]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to federal table */}
        <Route path="/" element={<Navigate to="/federal/table" replace />} />
        
        {/* Federal routes */}
        <Route path="/federal/table" element={<FederalTableView />} />
        <Route path="/federal/scorecard/:bioguideId/:congress" element={<FederalScorecardView />} />
        
        {/* State routes */}
        <Route path="/state/table" element={<StateTableView />} />
        <Route path="/state/scorecard/:state/:slesId/:term" element={<StateScorecardView />} />
        
        {/* Performance view */}
        <Route path="/performance/:bioguideId/:congress" element={<PerformanceView />} />
        
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
