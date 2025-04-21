import { partyColors } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface PartyLabelProps {
  party: keyof typeof partyColors;
}

export function PartyLabel({ party }: PartyLabelProps) {
  return (
    <span
      className={cn(
        "w-6 h-6 flex items-center justify-center rounded",
        partyColors[party]
      )}
    >
      {party}
    </span>
  );
}
