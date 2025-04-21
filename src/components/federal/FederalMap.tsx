import { Map } from "@/components/shared/Map";

interface FederalMapProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
  isSearchMode?: boolean;
}

export function FederalMap({
  selectedState,
  onStateSelect,
  isSearchMode = false,
}: FederalMapProps) {
  return (
    <Map
      selectedState={selectedState}
      onStateSelect={onStateSelect}
      isAvailable={isSearchMode ? () => false : undefined}
    />
  );
}
