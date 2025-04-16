import { StateChamber } from "@/lib/types";
import { GenericChamberSelector } from "../shared/ChamberSelector";
import { chamberLabels } from "@/lib/consts";

export const StateChamberSelector = (props: {
  selectedChamber: StateChamber;
  onChamberChange: (c: StateChamber) => void;
}) => (
  <GenericChamberSelector
    selected={props.selectedChamber}
    onChange={props.onChamberChange}
    labels={chamberLabels.state}
  />
);
