import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getValidTermDisplayName,
  getValidTermValue,
} from "@/lib/display";
import { ValidTerm } from "@/services/api.types";

interface TermSelectorProps {
  selectedTermString: string;
  onTermChange: (termString: string) => void;
  isLoading?: boolean;
  validTerms?: Array<ValidTerm>;
}

export function TermSelector({
  selectedTermString,
  onTermChange,
  isLoading = false,
  validTerms = [],
}: TermSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">TERM</label>
      <Select
        value={selectedTermString}
        onValueChange={onTermChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select term">
            {selectedTermString &&
              getValidTermDisplayName(
                validTerms.find(
                  (term) => getValidTermValue(term) === selectedTermString
                )!
              )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {validTerms.map((term) => (
            <SelectItem
              key={getValidTermValue(term)}
              value={getValidTermValue(term)}
            >
              {getValidTermDisplayName(term)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
