import { Map } from "@/components/shared/Map";

interface StateMapProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
}

// States with available data
const AVAILABLE_STATES = ["GA", "MT"] as const;

export function StateMap({ selectedState, onStateSelect }: StateMapProps) {
  return (
    <Map
      selectedState={selectedState}
      onStateSelect={onStateSelect}
      isAvailable={(stateCode) => AVAILABLE_STATES.includes(stateCode as any)}
    />
  );
}
