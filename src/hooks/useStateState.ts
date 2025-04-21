import type { StateChamber } from "@/lib/types";
import { useState } from "react";

export function useStateState() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [stateChamber, setStateChamber] = useState<StateChamber>("lower");
  const [stateSearchTerm, setStateSearchTerm] = useState("");

  return {
    selectedState,
    setSelectedState,
    selectedTerm,
    setSelectedTerm,
    stateChamber,
    setStateChamber,
    stateSearchTerm,
    setStateSearchTerm,
  };
}
