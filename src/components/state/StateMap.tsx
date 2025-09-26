import { Map } from "@/components/shared/Map";
import { AVAILABLE_STATES } from "@/lib/consts";

interface StateMapProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
}

export function StateMap({ selectedState, onStateSelect }: StateMapProps) {
  return (
    <Map
      selectedState={selectedState}
      onStateSelect={onStateSelect}
      isAvailable={(stateCode) => AVAILABLE_STATES.includes(stateCode as any)}
      deselectValue=""
    />
  );
}
