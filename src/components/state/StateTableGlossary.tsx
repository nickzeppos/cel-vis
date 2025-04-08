import { Card, CardContent } from "@/components/ui/card";
import { ExpectationIcon } from "../ExpectationIcon";
import { Expectation } from "@/lib/expectations";
import { colors } from "@/lib/colors";

const terms = [
  [
    'SLES',
    'A summary measure that captures how successful a member of the Upper or Lower legislative chamber is at moving her agenda items. The average SLES is 1.0.',
  ],
  [
    'Party Rank',
    "The ranking of a member's SLES in comparison to all other members of her political party in the Upper or Lower legislative chamber.",
  ],
  [
    'Benchmark',
    'The expected SLES of a member of the Upper or Lower legislative chamber given her party, tenure, and committee assignments.',
  ],
] as const;

export function StateTableGlossary() {
  return (
    <Card className="mt-4">
      <CardContent className="p-6 space-y-4 text-sm">
        <div className="space-y-2">
          <div className="font-medium">Expectation</div>
          <div className="text-muted-foreground">
            A legislator may either{' '}
            <span className="inline-flex items-center gap-1">
              meet
              <ExpectationIcon 
                expectation={Expectation.MEETS} 
                className="h-4 w-4"
                style={{ color: colors.meets }}
              />
            </span>
            ,{' '}
            <span className="inline-flex items-center gap-1">
              exceed
              <ExpectationIcon 
                expectation={Expectation.EXCEEDS} 
                className="h-4 w-4"
                style={{ color: colors.exceeds }}
              />
            </span>
            , or{' '}
            <span className="inline-flex items-center gap-1">
              score below
              <ExpectationIcon 
                expectation={Expectation.BELOW} 
                className="h-4 w-4"
                style={{ color: colors.below }}
              />
            </span>
            {' '}her expected SLES in a given state legislature.
          </div>
        </div>

        {terms.map(([term, definition]) => (
          <div key={term} className="space-y-1">
            <div className="font-medium">{term}</div>
            <div className="text-muted-foreground">
              {definition}
            </div>
          </div>
        ))}

        <div className="pt-2">
          To learn more, visit the{' '}
          <a 
            href="https://www.thelawmakers.org/glossary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 font-medium"
          >
            glossary
          </a>
          .
        </div>
      </CardContent>
    </Card>
  );
}