import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { FederalChamber } from "@/lib/types";
import { VisTableResponse } from "@/services/api.types";

type FederalTableState = {
  congress: string;
  chamber: FederalChamber;
  searchTerm: string;
  stateFilter: string;
  selectedIssue: string;
  tableData: VisTableResponse | null;
};

type StateTableState = {
  selectedState: string;
  selectedTerm: string;
  stateChamber: "upper" | "lower";
  stateSearchTerm: string;
};

type TableStateContextType = {
  federalState: FederalTableState;
  updateFederalState: (state: Partial<FederalTableState>) => void;
  resetFederalState: () => void;
  stateTableState: StateTableState;
  updateStateTableState: (state: Partial<StateTableState>) => void;
  resetStateTableState: () => void;
  // In addition to data related context, we're going to use provider here to help track and send updates about the height of the app to the iframe
  updateHeight: () => void;
};

const defaultFederalState: FederalTableState = {
  congress: "118",
  chamber: "house",
  searchTerm: "",
  stateFilter: "all",
  selectedIssue: "all",
  tableData: null,
};

const defaultStateTableState: StateTableState = {
  selectedState: "",
  selectedTerm: "",
  stateChamber: "lower",
  stateSearchTerm: "",
};

const TableStateContext = createContext<TableStateContextType | undefined>(
  undefined
);

export const TableStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [federalState, setFederalState] =
    useState<FederalTableState>(defaultFederalState);
  const [stateTableState, setStateTableState] = useState<StateTableState>(
    defaultStateTableState
  );

  // Track when DOM updates might affect height
  const contentChanged = useRef(false);

  // Function to update iframe height
  const updateHeight = useCallback(() => {
    const height = document.documentElement.scrollHeight;
    console.log("[iframe] Sending height:", height);
    if (window.parent) {
      window.parent.postMessage({ type: "setHeight", height }, "*");
    }
  }, []);

  // Then send height on every state change
  const updateFederalState = (newState: Partial<FederalTableState>) => {
    contentChanged.current = true;
    setFederalState((current) => ({ ...current, ...newState }));
  };

  const resetFederalState = () => {
    contentChanged.current = true;
    setFederalState(defaultFederalState);
  };

  const updateStateTableState = (newState: Partial<StateTableState>) => {
    contentChanged.current = true;
    setStateTableState((current) => ({ ...current, ...newState }));
  };

  const resetStateTableState = () => {
    contentChanged.current = true;
    setStateTableState(defaultStateTableState);
  };

  // Use useLayoutEffect to measure height right after DOM mutations
  useLayoutEffect(() => {
    if (contentChanged.current) {
      updateHeight();
      contentChanged.current = false;
    }
  });

  // Also set up a resize listener for window size changes
  useLayoutEffect(() => {
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

  // Initial height measurement on mount
  useLayoutEffect(() => {
    updateHeight();
  }, []);

  return (
    <TableStateContext.Provider
      value={{
        federalState,
        updateFederalState,
        resetFederalState,
        stateTableState,
        updateStateTableState,
        resetStateTableState,
        updateHeight,
      }}
    >
      {children}
    </TableStateContext.Provider>
  );
};

export const useTableState = () => {
  const context = useContext(TableStateContext);
  if (context === undefined) {
    throw new Error("useTableState must be used within a TableStateProvider");
  }
  return context;
};
