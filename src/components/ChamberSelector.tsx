import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { chamberLabels } from '@/lib/consts'
import { FederalChamber, StateChamber } from "@/lib/types";



// Federal Chamber Selector
interface FederalChamberSelectorProps {
  selectedChamber: FederalChamber;
  onChamberChange: (chamber: FederalChamber) => void;
}

export function FederalChamberSelector({ 
  selectedChamber,
  onChamberChange 
}: FederalChamberSelectorProps) {
  const labels = chamberLabels.federal;
  const values = Object.keys(labels) as FederalChamber[];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">CHAMBER</label>
      <ToggleGroup
        type="single"
        value={selectedChamber}
        onValueChange={(value) => value && onChamberChange(value as FederalChamber)}
        className="justify-stretch"
      >
        {values.map(value => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90"
            aria-label={labels[value]}
          >
            {labels[value]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

// State Chamber Selector
interface StateChamberSelectorProps {
  selectedChamber: StateChamber;
  onChamberChange: (chamber: StateChamber) => void;
}

export function StateChamberSelector({ 
  selectedChamber,
  onChamberChange 
}: StateChamberSelectorProps) {
  const labels = chamberLabels.state;
  const values = Object.keys(labels) as StateChamber[];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">CHAMBER</label>
      <ToggleGroup
        type="single"
        value={selectedChamber}
        onValueChange={(value) => value && onChamberChange(value as StateChamber)}
        className="justify-stretch"
      >
        {values.map(value => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90"
            aria-label={labels[value]}
          >
            {labels[value]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}