import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { StateMap, states } from "@/components/StateMap";
import { TableGlossary } from "../TableGlossary";
import { useCongressList } from "@/hooks/useCongressList";
import { getCongressDisplayName } from "@/lib/congress";
import { getIssueDisplayName } from "@/lib/display";

// Get the keys from issueDisplayNames and sort them
const AVAILABLE_ISSUES = [
  "agriculture",
  "civilrights",
  "commerce",
  "defense",
  "education",
  "energy",
  "environment",
  "governmentops",
  "health",
  "immigration",
  "internationalaffairs",
  "labor",
  "lawcrime",
  "macro",
  "nativeamericans",
  "publiclands",
  "technology",
  "trade",
  "transportation",
  "welfare",
  "housing",
].sort();

interface FederalControlPanelProps {
  congress: string;
  chamber: 'house' | 'senate';
  selectedState: string;
  onCongressChange: (value: string) => void;
  onChamberChange: (value: 'house' | 'senate') => void;
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  selectedIssue?: string;
  onIssueChange?: (value: string) => void;
}

export function FederalControlPanel({
  congress,
  chamber,
  selectedState,
  onCongressChange,
  onChamberChange,
  onFilterChange,
  onSearchChange,
  selectedIssue = 'all',
  onIssueChange = () => {},
}: FederalControlPanelProps) {
  const [filterMode, setFilterMode] = React.useState<'state' | 'search'>('state');
  const [searchInputValue, setSearchInputValue] = React.useState('');
  const { congressList, isLoading } = useCongressList();

  // Handle filter mode change
  const handleFilterModeChange = (value: string) => {
    if (value) {
      const newMode = value as 'state' | 'search';
      setFilterMode(newMode);
      
      // Reset relevant state when switching modes
      if (newMode === 'state') {
        setSearchInputValue('');
        onSearchChange('');
      } else {
        // When switching to search mode, reset state filter
        onFilterChange('all');
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    onSearchChange(value);
    
    // Reset state filter on any search input change
    if (selectedState !== 'all') {
      onFilterChange('all');
    }
  };

  // Handle state selection
  const handleStateSelect = (state: string) => {
    // If we're in search mode, switch back to state mode
    if (filterMode === 'search') {
      setFilterMode('state');
      setSearchInputValue('');
      onSearchChange('');
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
                    <SelectValue placeholder={isLoading ? "Loading..." : "Select Congress"}>
                      {congress && `${getCongressDisplayName(parseInt(congress))} Congress`}
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CHAMBER</label>
                <ToggleGroup
                  type="single"
                  value={chamber}
                  onValueChange={(value) => value && onChamberChange(value as 'house' | 'senate')}
                  className="justify-stretch"
                >
                  <ToggleGroupItem
                    value="house"
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90"
                    aria-label="House"
                  >
                    House
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="senate"
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90"
                    aria-label="Senate"
                  >
                    Senate
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ISSUE</label>
                <Select value={selectedIssue} onValueChange={onIssueChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue">
                      {selectedIssue === 'all' ? 'All Issues' : getIssueDisplayName(selectedIssue)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issues</SelectItem>
                    {AVAILABLE_ISSUES.map((issue) => (
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
              <ToggleGroup
                type="single"
                value={filterMode}
                onValueChange={handleFilterModeChange}
                className="justify-stretch"
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
                  aria-label="Search"
                >
                  Search
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="space-y-4">
                <div className="h-[40px]">
                  {filterMode === 'state' ? (
                    <Select value={selectedState} onValueChange={handleStateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state">
                          {selectedState === 'all' ? 'All States' : selectedState}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {Object.keys(states).sort().map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type="text"
                      placeholder="Search by name or zip"
                      value={searchInputValue}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  )}
                </div>

                <StateMap
                  selectedState={selectedState}
                  onStateSelect={handleStateSelect}
                  isSearchMode={filterMode === 'search'}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TableGlossary />
    </div>
  );
}