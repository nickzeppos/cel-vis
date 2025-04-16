import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getChamberDisplayName, getCongressDisplayName } from "@/lib/display";
import type { ValidCongress } from "@/services/api.types";

interface CongressSelectorProps {
  validCongresses: ValidCongress[];
  selectedCongress: number;
  onCongressChange: (congress: number) => void;
}

export function CongressSelector({
  validCongresses,
  selectedCongress,
  onCongressChange,
}: CongressSelectorProps) {
  // Sort congresses in descending order and find the current congress's chamber
  const sortedCongresses = [...validCongresses].sort(([a], [b]) => b - a);
  const currentChamber =
    validCongresses.find(([congress]) => congress === selectedCongress)?.[1] ||
    "H";

  return (
    <Select
      value={selectedCongress.toString()}
      onValueChange={(value) => onCongressChange(parseInt(value))}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {getCongressDisplayName(selectedCongress)}{" "}
          {getChamberDisplayName(currentChamber)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortedCongresses.map(([congress, chamber]) => (
          <SelectItem key={congress} value={congress.toString()}>
            {getCongressDisplayName(congress)} {getChamberDisplayName(chamber)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
