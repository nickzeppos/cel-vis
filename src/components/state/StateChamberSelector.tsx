import { StateChamber } from "@/lib/types";
import { GenericChamberSelector } from "../shared/ChamberSelector";
import { chamberLabels } from "@/lib/consts";

const UNICAMERAL_STATES = ["NE"];

export const StateChamberSelector = (props: {
  selectedState: string;
  selectedChamber: StateChamber;
  onChamberChange: (c: StateChamber) => void;
}) => (
  <GenericChamberSelector
    selected={props.selectedChamber}
    onChange={props.onChamberChange}
    labels={chamberLabels.state}
    disabledValues={
      UNICAMERAL_STATES.includes(props.selectedState) ? ["lower"] : []
    }
  />
);
