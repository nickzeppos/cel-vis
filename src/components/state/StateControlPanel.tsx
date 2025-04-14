import { StateChamberSelector } from "@/components/ChamberSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTermList } from "@/hooks/useTermList";
import { getTermValue } from "@/lib/display";
import type { StateChamber } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { StateMap } from "./StateMap";

// States with available data
const AVAILABLE_STATES = ["GA", "MT"] as const;
interface StateControlPanelProps {
  selectedState: string;
  selectedTerm: string;
  selectedChamber: StateChamber;
  onStateSelect: (state: string) => void;
  onTermChange: (term: string) => void;
  onChamberChange: (chamber: StateChamber) => void;
  onSearchChange?: (value: string) => void;
}

export function StateControlPanel({
  selectedState,
  selectedTerm,
  selectedChamber,
  onStateSelect,
  onTermChange,
  onChamberChange,
  onSearchChange = () => {},
}: StateControlPanelProps) {
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const { termList = [], isLoading } = useTermList(selectedState);

  const handleStateSelect = (state: string) => {
    if (state === "") {
      onStateSelect("");
      onTermChange("");
      onChamberChange("lower");
      return;
    } else {
      onStateSelect(state);
    }
  };

  useEffect(() => {
    if (!selectedState || isLoading || termList.length === 0) return;

    const termExists = termList.some(
      (term) => getTermValue(term) === selectedTerm
    );

    if (!termExists) {
      const mostRecentTerm = termList[0];
      onTermChange(getTermValue(mostRecentTerm));
    }
  }, [selectedState, termList, isLoading]);

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    onSearchChange(value);
  };

  // const [searchInputValue, setSearchInputValue] = React.useState("");
  // const { termList = [], isLoading, error } = useTermList(selectedState);
  // const handleStateSelect = (state: string) => {
  //   // If going from selected state to unselected state, clear term and chamber
  //   if (state === "") {
  //     onStateSelect("");
  //     onTermChange("");
  //     onChamberChange("lower");
  //     return;
  //   }

  //   // If going from unselected state to selected state, set default term and chamber
  //   if (!selectedState) {
  //     const availableTerms = stateTerms[state] || [];
  //     if (availableTerms.length > 0) {
  //       const mostRecentTerm = availableTerms[0];
  //       onStateSelect(state);
  //       onTermChange(getTermValue(mostRecentTerm));
  //       onChamberChange(mostRecentTerm.chamber);
  //       return;
  //     }
  //   }

  //   // If switching between states, keep the current term if it exists in the new state
  //   const availableTerms = stateTerms[state] || [];
  //   const termExists = availableTerms.some(
  //     (term) => getTermValue(term) === selectedTerm
  //   );

  //   onStateSelect(state);

  //   if (!termExists && availableTerms.length > 0) {
  //     // If current term doesn't exist in new state, set to most recent term
  //     const mostRecentTerm = availableTerms[0];
  //     onTermChange(getTermValue(mostRecentTerm));
  //     onChamberChange(mostRecentTerm.chamber);
  //   }
  // };

  // // Handle search input change
  // const handleSearchChange = (value: string) => {
  //   setSearchInputValue(value);
  //   onSearchChange(value);
  // };

  // // Get available terms for the selected state
  // const availableTerms = selectedState ? stateTerms[selectedState] || [] : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* State Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                FILTER BY STATE
              </label>
              <Select
                value={selectedState === "all" ? "" : selectedState}
                onValueChange={handleStateSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <StateMap
              selectedState={selectedState}
              onStateSelect={handleStateSelect}
            />

            {/* Pre-allocate space for additional controls */}
            <div
              className={cn(
                "space-y-6 transition-all duration-200",
                selectedState ? "opacity-100" : "opacity-0 h-0 overflow-hidden" // Hide completely when no state selected
              )}
            >
              {selectedState && (
                <>
                  <Separator className="bg-gray-200 h-[2px]" />

                  {/* Term Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      TERM
                    </label>
                    <Select value={selectedTerm} onValueChange={onTermChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term">
                          {selectedTerm}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {termList.map((term) => (
                          <SelectItem
                            key={getTermValue(term)}
                            value={getTermValue(term)}
                          >
                            {getTermValue(term)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Chamber Selector */}
                  <StateChamberSelector
                    selectedChamber={selectedChamber}
                    onChamberChange={onChamberChange}
                  />

                  {/* Search by name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      SEARCH BY NAME
                    </label>
                    <Input
                      type="text"
                      placeholder="Search by name"
                      value={searchInputValue}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
