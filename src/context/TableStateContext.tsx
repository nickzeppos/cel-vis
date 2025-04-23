import React, { createContext, useContext, useState } from "react";
import type { FederalChamber } from "@/lib/types";
import type { VisTableResponse } from "@/services/api.types";

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

  const updateFederalState = (newState: Partial<FederalTableState>) => {
    setFederalState((current) => ({ ...current, ...newState }));
  };

  const resetFederalState = () => {
    setFederalState(defaultFederalState);
  };

  const updateStateTableState = (newState: Partial<StateTableState>) => {
    setStateTableState((current) => ({ ...current, ...newState }));
  };

  const resetStateTableState = () => {
    setStateTableState(defaultStateTableState);
  };

  return (
    <TableStateContext.Provider
      value={{
        federalState,
        updateFederalState,
        resetFederalState,
        stateTableState,
        updateStateTableState,
        resetStateTableState,
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
