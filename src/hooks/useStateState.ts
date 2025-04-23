import type { StateChamber } from "@/lib/types";
import { useTableState } from "@/context/TableStateContext";

export function useStateState() {
  const { stateTableState, updateStateTableState } = useTableState();

  const { selectedState, selectedTerm, stateChamber, stateSearchTerm } =
    stateTableState;

  return {
    selectedState,
    setSelectedState: (state: string) =>
      updateStateTableState({ selectedState: state }),

    selectedTerm,
    setSelectedTerm: (term: string) =>
      updateStateTableState({ selectedTerm: term }),

    stateChamber,
    setStateChamber: (chamber: StateChamber) =>
      updateStateTableState({ stateChamber: chamber }),

    stateSearchTerm,
    setStateSearchTerm: (term: string) =>
      updateStateTableState({ stateSearchTerm: term }),
  };
}
