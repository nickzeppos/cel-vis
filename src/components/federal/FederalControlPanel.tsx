import { FederalChamberSelector } from "./FederalChamberSelector";
import { states } from "@/components/shared/Map";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCongressList } from "@/hooks/useCongressList";
import { getIssueDisplayName, getCongressDisplayName } from "@/lib/display";
import type { FederalChamber } from "@/lib/types";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { FederalMap } from "./FederalMap";
import { SearchInput } from "../shared/SearchInput";

interface FederalControlPanelProps {
  congress: string;
  chamber: FederalChamber;
  selectedState: string;
  onCongressChange: (value: string) => void;
  onChamberChange: (value: FederalChamber) => void;
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  selectedIssue?: string;
  onIssueChange?: (value: string) => void;
  availableIssues?: string[];
}

export function FederalControlPanel({
  congress,
  chamber,
  selectedState,
  onCongressChange,
  onChamberChange,
  onFilterChange,
  onSearchChange,
  selectedIssue = "all",
  onIssueChange = () => {},
  availableIssues = [],
}: FederalControlPanelProps) {
  const [filterMode, setFilterMode] = React.useState<"state" | "search">(
    "state"
  );
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const { congressList = [], isLoading } = useCongressList();
  // Handle filter mode change
  const handleFilterModeChange = (value: string) => {
    if (value) {
      const newMode = value as "state" | "search";
      setFilterMode(newMode);

      // Reset relevant state when switching modes
      if (newMode === "state") {
        setSearchInputValue("");
        onSearchChange("");
      } else {
        // When switching to search mode, reset state filter
        onFilterChange("all");
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    onSearchChange(value);

    // Reset state filter on any search input change
    if (selectedState !== "all") {
      onFilterChange("all");
    }
  };

  // Handle state selection
  const handleStateSelect = (state: string) => {
    // If we're in search mode, switch back to state mode
    if (filterMode === "search") {
      setFilterMode("state");
      setSearchInputValue("");
      onSearchChange("");
    }
    onFilterChange(state);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CONGRESS</label>
                <Select
                  value={congress}
                  onValueChange={onCongressChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isLoading ? "Loading..." : "Select Congress"}
                    >
                      {congress &&
                        `${getCongressDisplayName(
                          parseInt(congress)
                        )} Congress`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {congressList.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {getCongressDisplayName(num)} Congress
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FederalChamberSelector
                selectedChamber={chamber}
                onChamberChange={onChamberChange}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ISSUE</label>
                <Select value={selectedIssue} onValueChange={onIssueChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue">
                      {selectedIssue === "all"
                        ? "All Issues"
                        : getIssueDisplayName(selectedIssue)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issues</SelectItem>
                    {availableIssues.map((issue) => (
                      <SelectItem key={issue} value={issue}>
                        {getIssueDisplayName(issue)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="bg-gray-200 h-[2px]" />

            <div className="space-y-4">
              <div className="space-y-4">
                <ToggleGroup
                  type="single"
                  value={filterMode}
                  onValueChange={handleFilterModeChange}
                  className="w-full justify-stretch"
                >
                  <ToggleGroupItem
                    value="state"
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90"
                    aria-label="Filter by State"
                  >
                    Filter by State
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="search"
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90"
                    aria-label="Search by Name or Zip"
                  >
                    Search
                  </ToggleGroupItem>
                </ToggleGroup>
                <div className="space-y-2">
                  {filterMode === "state" ? (
                    <>
                      <label className="text-sm font-medium text-gray-700">STATE</label>
                      <Select
                        value={selectedState}
                        onValueChange={handleStateSelect}
                      >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state">
                          {selectedState === "all"
                            ? "All States"
                            : selectedState}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {Object.keys(states)
                          .sort()
                          .map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium text-gray-700">SEARCH</label>
                      <SearchInput
                        value={searchInputValue}
                        onChange={handleSearchChange}
                        placeholder="Search by name"
                      />
                    </>
                  )}
                </div>

                <FederalMap
                  selectedState={selectedState}
                  onStateSelect={handleStateSelect}
                  isSearchMode={filterMode === "search"}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
