import { StateChamberSelector } from "@/components/state/StateChamberSelector";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTermList } from "@/hooks/useTermList";
import { getTermDisplayName } from "@/lib/display";
import type { StateChamber } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { StateMap } from "@/components/state/StateMap";
import { AVAILABLE_STATES } from "@/lib/consts";

// States with available data

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
      (term) => getTermDisplayName(term) === selectedTerm
    );

    if (!termExists) {
      const mostRecentTerm = termList[0];
      onTermChange(getTermDisplayName(mostRecentTerm));
    }
  }, [selectedState, termList, isLoading]);

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    onSearchChange(value);
  };

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
                value={selectedState || ""}
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
                            key={getTermDisplayName(term)}
                            value={getTermDisplayName(term)}
                          >
                            {getTermDisplayName(term)}
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
                    <SearchInput
                      label="SEARCH"
                      value={searchInputValue}
                      onChange={handleSearchChange}
                      placeholder="Search by name"
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
