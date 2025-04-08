import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpectationIcon } from "./ExpectationIcon";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { getIssueDisplayName } from "@/lib/display";
import type { TableRow, ScoreComponentsResponse } from "@/services/api";
import { useState, useRef, useEffect } from "react";
import { ScorecardGlossary } from "./ScorecardGlossary";
import { ScoreButton } from "./ScoreButton";
import { ScoreMatrix } from "./ScoreMatrix";
import { CongressSelector } from "./CongressSelector";
import { getTableData, getScoreComponentsData } from "@/services/api";

interface ScorecardViewProps {
  legislator: TableRow;
  scorecard: ScoreComponentsResponse | null;
  onBack: () => void;
}

export function ScorecardView({ legislator: initialLegislator, scorecard: initialScorecard, onBack }: ScorecardViewProps) {
  const [selectedIssue, setSelectedIssue] = useState<string>("overall");
  const [selectedCongress, setSelectedCongress] = useState<number>(initialScorecard?.congress || 0);
  const [matrixHeight, setMatrixHeight] = useState<number>(0);
  const matrixRef = useRef<HTMLDivElement>(null);
  const issueListRef = useRef<HTMLDivElement>(null);
  const [legislator, setLegislator] = useState<TableRow>(initialLegislator);
  const [scorecard, setScorecard] = useState<ScoreComponentsResponse | null>(initialScorecard);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (matrixRef.current) {
      setMatrixHeight(matrixRef.current.offsetHeight);
    }
  }, []);

  // Scroll to selected issue whenever it changes or when congress changes
  useEffect(() => {
    if (issueListRef.current && selectedIssue !== 'overall') {
      const selectedButton = issueListRef.current.querySelector(`[data-issue="${selectedIssue}"]`);
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIssue, selectedCongress]);

  const handleCongressChange = async (congress: number) => {
    setIsLoading(true);
    try {
      // Fetch new table data for the selected congress
      const tableData = await getTableData(congress);
      const newLegislator = tableData.data.find(l => l.bioguide === initialLegislator.bioguide);
      
      if (!newLegislator) {
        throw new Error('Legislator not found in selected congress');
      }

      // Fetch new scorecard data
      const newScorecard = await getScoreComponentsData(congress, initialLegislator.bioguide);
      
      setSelectedCongress(congress);
      setLegislator(newLegislator);
      setScorecard(newScorecard);
      
      // Only reset to overall if the selected issue doesn't exist in the new congress
      if (selectedIssue !== 'overall' && !(selectedIssue.toLowerCase() in newLegislator.iles)) {
        setSelectedIssue('overall');
      }
    } catch (error) {
      console.error('Failed to load data for congress:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const locationText = legislator.chamber === 'S'
    ? legislator.state
    : `${legislator.state}-${legislator.district}`;

  const expectation = getExpectation(legislator.les, legislator.benchmark);
  const expectationColor = getExpectationColor(expectation);

  const partyBgColor = {
    'R': 'bg-red-100',
    'D': 'bg-blue-100',
    'I': 'bg-gray-100'
  }[legislator.party];

  // Get all possible issues and their scores, including zeros
  const issueScores = Object.entries(legislator.iles)
    .sort(([, a], [, b]) => b - a);

  const matrix = scorecard?.data.issues[selectedIssue.toLowerCase()] || scorecard?.data.overall;

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className={cn(
          "mb-4 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700",
          "transition-colors duration-200"
        )}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-[2fr,3fr] gap-6">
        <div className="space-y-6">
          <Card className="shadow-none border-0">
            <CardHeader className="pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  {legislator.name}
                </CardTitle>
                <div className="text-sm text-muted-foreground flex gap-8 font-mono">
                  <span className={cn(
                    "w-6 h-6 flex items-center justify-center rounded",
                    partyBgColor
                  )}>
                    {legislator.party}
                  </span>
                  <span>{locationText}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {scorecard?.data.validCongresses && (
                <CongressSelector
                  validCongresses={scorecard.data.validCongresses}
                  selectedCongress={selectedCongress}
                  onCongressChange={handleCongressChange}
                />
              )}

              <div className="flex flex-col h-full">
                <div className="space-y-2">
                  <ScoreButton
                    title="Overall"
                    score={legislator.les}
                    isSelected={selectedIssue === "overall"}
                    expectation={expectation}
                    color={expectationColor}
                    onClick={() => setSelectedIssue("overall")}
                  />
                </div>

                <div className="flex-1 min-h-0 mt-6">
                  <h3 className="font-semibold px-4 mb-2">Issues</h3>
                  <div 
                    ref={issueListRef}
                    className="space-y-2 overflow-y-auto pr-2" 
                    style={{ 
                      maxHeight: matrixHeight ? `${matrixHeight - 180}px` : undefined,
                      paddingTop: '8px',
                      paddingBottom: '8px'
                    }}
                  >
                    {issueScores.map(([issue, score]) => (
                      <ScoreButton
                        key={issue}
                        title={getIssueDisplayName(issue)}
                        score={score}
                        isSelected={selectedIssue === issue}
                        onClick={() => setSelectedIssue(issue)}
                        data-issue={issue}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ScorecardGlossary />
        </div>

        {scorecard && matrix && (
          <Card className="shadow-none border-0">
            <CardContent className="pt-6" ref={matrixRef}>
              <ScoreMatrix matrix={matrix} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}