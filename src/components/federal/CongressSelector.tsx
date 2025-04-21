import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getValidCongressDisplayName } from "@/lib/display";
import type { ValidCongress } from "@/services/api.types";

interface CongressSelectorProps {
  validCongresses: Array<ValidCongress>;
  selectedCongress: number;
  onCongressChange: (congress: number) => void;
  isLoading?: boolean;
}

export function CongressSelector({
  validCongresses,
  selectedCongress,
  onCongressChange,
  isLoading = false,
}: CongressSelectorProps) {
  const currentChamber =
    validCongresses.find(([congress]) => congress === selectedCongress)?.[1] ||
    "H";

  return (
    <Select
      value={selectedCongress.toString()}
      onValueChange={(value) => onCongressChange(parseInt(value))}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {getValidCongressDisplayName([selectedCongress, currentChamber])}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {validCongresses.map(([congress, chamber]) => (
          <SelectItem key={congress} value={congress.toString()}>
            {getValidCongressDisplayName([congress, chamber])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
