import { FederalChamber } from "@/lib/types";
import { GenericChamberSelector } from "../ChamberSelector";
import { chamberLabels } from "@/lib/consts";

export const FederalChamberSelector = (props: {
  selectedChamber: FederalChamber;
  onChamberChange: (c: FederalChamber) => void;
}) => (
  <GenericChamberSelector
    selected={props.selectedChamber}
    onChange={props.onChamberChange}
    labels={chamberLabels.federal}
  />
);
