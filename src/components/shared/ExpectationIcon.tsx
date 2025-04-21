import { XCircle, CircleCheck, CirclePlus } from "lucide-react";
import { Expectation } from "@/lib/expectations";

interface ExpectationIconProps {
  expectation: Expectation;
  className?: string;
  style?: React.CSSProperties;
}

export function ExpectationIcon({ expectation, className, style }: ExpectationIconProps) {
  switch (expectation) {
    case Expectation.BELOW:
      return <XCircle className={className} style={style} />;
    case Expectation.MEETS:
      return <CircleCheck className={className} style={style} />;
    case Expectation.EXCEEDS:
      return <CirclePlus className={className} style={style} />;
  }
}