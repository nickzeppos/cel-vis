import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface GenericChamberSelectorProps<T extends string> {
  selected: T;
  onChange: (value: T) => void;
  labels: Record<T, string>;
  disabledValues?: T[];
}

export function GenericChamberSelector<T extends string>({
  selected,
  onChange,
  labels,
  disabledValues = [],
}: GenericChamberSelectorProps<T>) {
  const values = Object.keys(labels) as T[];
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">CHAMBER</label>
      <ToggleGroup
        type="single"
        value={selected}
        onValueChange={(value) => value && onChange(value as T)}
        className="justify-stretch"
      >
        {values.map((value) => {
          const isDisabled = disabledValues.includes(value);
          return (
            <ToggleGroupItem
              key={value}
              value={value}
              disabled={isDisabled}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90 disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-auto"
              aria-label={labels[value]}
            >
              {labels[value]}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
