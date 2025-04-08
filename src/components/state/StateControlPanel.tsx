import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { StateMap } from "@/components/state/StateMap";
import { states } from "@/components/Map";
import { StateTableGlossary } from "./StateTableGlossary";
import { cn } from "@/lib/utils";
import type { StateChamber } from "@/services/api";

// States with available data
const AVAILABLE_STATES = ['GA', 'MT'] as const;

interface StateControlPanelProps {
  selectedState: string;
  selectedTerm: string;
  selectedChamber: StateChamber;
  onStateSelect: (state: string) => void;
  onTermChange: (term: string) => void;
  onChamberChange: (chamber: StateChamber) => void;
  onSearchChange?: (value: string) => void;
}

const TERMS = [
  { label: '2017-2018', value: '2017-2018' },
  { label: '2015-2016', value: '2015-2016' }
];

export function StateControlPanel({ 
  selectedState,
  selectedTerm,
  selectedChamber,
  onStateSelect,
  onTermChange,
  onChamberChange,
  onSearchChange = () => {}
}: StateControlPanelProps) {
  const [searchInputValue, setSearchInputValue] = React.useState('');

  const handleStateSelect = (state: string) => {
    onStateSelect(state);
    // When selecting a state, default to most recent term and lower chamber
    if (state && !selectedTerm) {
      onTermChange(TERMS[0].value);
      onChamberChange('lower');
    }
  };

  // Handle search input change
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
              <label className="text-sm font-medium text-gray-700">FILTER BY STATE</label>
              <Select 
                value={selectedState === 'all' ? '' : selectedState} 
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
            <div className={cn(
              "space-y-6 transition-all duration-200",
              selectedState ? "opacity-100" : "opacity-0 h-[280px]" // Pre-allocate approximate space
            )}>
              {selectedState && (
                <>
                  <Separator className="bg-gray-200 h-[2px]" />

                  {/* Term Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">TERM</label>
                    <Select value={selectedTerm} onValueChange={onTermChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        {TERMS.map(term => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Chamber Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">CHAMBER</label>
                    <ToggleGroup
                      type="single"
                      value={selectedChamber}
                      onValueChange={(value) => value && onChamberChange(value as StateChamber)}
                      className="justify-stretch"
                    >
                      <ToggleGroupItem
                        value="lower"
                        className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90"
                        aria-label="Lower"
                      >
                        Lower
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="upper"
                        className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90"
                        aria-label="Upper"
                      >
                        Upper
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Search by name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">SEARCH BY NAME</label>
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

      <StateTableGlossary />
    </div>
  );
}