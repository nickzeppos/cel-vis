import { Card, CardContent } from "@/components/ui/card";

const terms = [
  ['c', 'Commemorative bills'],
  ['s', 'Substantive bills'],
  ['ss', 'Substantive and Significant bills'],
  ['bill', 'Number of bills this member sponsored'],
  ['aic', 'Number of bills receiving "Action in Committee"'],
  ['abc', 'Number of bills receiving "Action beyond Committee"'],
  ['pass', 'Number of bills passing the chamber of origin'],
  ['law', 'Number of bills becoming law'],
] as const;

export function StateScorecardGlossary() {
  return (
    <Card className="shadow-none border-0">
      <CardContent className="p-6 space-y-1 text-sm">
        {terms.map(([term, definition]) => (
          <div key={term}>
            <span className="font-medium uppercase">{term}</span>
            <span className="text-muted-foreground">: {definition}</span>
          </div>
        ))}

        <div className="pt-2 mt-2 border-t">
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