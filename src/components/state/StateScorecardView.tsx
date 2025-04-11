import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpectationIcon } from "../ExpectationIcon";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { getTermDisplayName, getTermValue } from "@/lib/display";
import { ScoreMatrix } from "../ScoreMatrix";
import { StateScorecardGlossary } from "./StateScorecardGlossary";
import { getStateScorecardData, getStateTableData } from "@/services/api";
import type {
  StateVisTable,
  StateVisScorecardResponse,
} from "@/services/api.types";
import { toast } from "sonner";

interface StateScorecardProps {
  legislator: StateVisTable;
  scorecard: StateVisScorecardResponse | null;
  initialTerm: string;
  onBack: () => void;
}

export function StateScorecardView({
  legislator: initialLegislator,
  scorecard: initialScorecard,
  initialTerm,
  onBack,
}: StateScorecardProps) {
  const [scorecard, setScorecard] = useState<StateVisScorecardResponse | null>(
    initialScorecard
  );
  const [selectedTerm, setSelectedTerm] = useState<string>(initialTerm);
  const [legislator, setLegislator] =
    useState<StateVisTable>(initialLegislator);
  const [isLoading, setIsLoading] = useState(false);

  const handleTermChange = async (termString: string) => {
    setIsLoading(true);

    const [startYear, endYear] = termString.split("-").map(Number);

    try {
      // Fetch new table data first to get updated LES and rank
      const tableData = await getStateTableData(
        legislator.state,
        startYear,
        endYear
      );
      const updatedLegislator = tableData.data.find(
        (l) => l.slesId === legislator.slesId
      );

      if (!updatedLegislator) {
        toast.error("Legislator data not available for the selected term");
        return;
      }

      // Then fetch new scorecard data
      const newScorecard = await getStateScorecardData(
        legislator.slesId,
        startYear,
        endYear
      );

      // Only update state if both fetches succeed
      setSelectedTerm(termString);
      setLegislator(updatedLegislator);
      setScorecard(newScorecard);
    } catch (err) {
      toast.error("Failed to load legislator data for the selected term");
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const locationText = `District ${legislator.district}`;

  const partyBgColor = {
    R: "bg-red-100",
    D: "bg-blue-100",
    "3rd": "bg-gray-100",
  }[legislator.party];

  // Sort terms in descending order
  const sortedTerms =
    scorecard?.validStateTerms?.sort((a, b) => b.startYear - a.startYear) || [];

  // Get expectation and color
  const expectation = getExpectation(legislator.sles, legislator.benchmark);
  const expectationColor = getExpectationColor(expectation);

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
                <CardTitle className="text-2xl">{legislator.name}</CardTitle>
                <div className="text-sm text-muted-foreground flex gap-8 font-mono">
                  <span
                    className={cn(
                      "w-6 h-6 flex items-center justify-center rounded",
                      partyBgColor
                    )}
                  >
                    {legislator.party}
                  </span>
                  <span>{locationText}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {scorecard?.validStateTerms &&
                scorecard.validStateTerms.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      TERM
                    </label>
                    <Select
                      value={selectedTerm}
                      onValueChange={handleTermChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select term">
                          {selectedTerm &&
                            getTermDisplayName(
                              sortedTerms.find(
                                (term) => getTermValue(term) === selectedTerm
                              )!
                            )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {sortedTerms.map((term) => (
                          <SelectItem
                            key={getTermValue(term)}
                            value={getTermValue(term)}
                          >
                            {getTermDisplayName(term)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

              <div className="flex flex-col h-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-md">
                    <span className="font-medium">SLES</span>
                    <div className="flex items-center">
                      <span
                        className="font-mono text-lg min-w-[72px] text-right"
                        style={{ color: expectationColor }}
                      >
                        {legislator.sles.toFixed(3)}
                      </span>
                      <ExpectationIcon
                        expectation={expectation}
                        className="h-5 w-5 ml-2"
                        style={{ color: expectationColor }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-md">
                    <span className="font-medium">Benchmark</span>
                    <span className="font-mono">
                      {legislator.benchmark.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-md">
                    <span className="font-medium">Party Rank</span>
                    <span className="font-mono whitespace-nowrap">
                      {legislator.partyRank}/{legislator.partyTotal}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <StateScorecardGlossary />
        </div>

        {scorecard?.data?.overall && (
          <Card className="shadow-none border-0">
            <CardContent className="pt-6">
              <ScoreMatrix matrix={scorecard.data.overall} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
