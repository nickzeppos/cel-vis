import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTermDisplayName, getTermValue } from "@/lib/display";
import type { StateTerm } from "@/lib/types";

interface TermSelectorProps {
  selectedTerm: string;
  onTermChange: (term: string) => void;
  validStateTerms?: Array<StateTerm & { chamber: 'upper' | 'lower' }>;
}

export function TermSelector({ selectedTerm, onTermChange, validStateTerms = [] }: TermSelectorProps) {
  // Sort terms in descending order
  const sortedTerms = [...validStateTerms].sort((a, b) => b.startYear - a.startYear);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">TERM</label>
      <Select value={selectedTerm} onValueChange={onTermChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select term">
            {selectedTerm && validStateTerms?.find(term => getTermValue(term) === selectedTerm) && 
              getTermDisplayName(validStateTerms.find(term => getTermValue(term) === selectedTerm)!)
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortedTerms.map(term => (
            <SelectItem 
              key={getTermValue(term)} 
              value={getTermValue(term)}
            >
              {getTermDisplayName(term)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}