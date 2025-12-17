import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStateLocationText,
  getValidTermDisplayName,
  getTermDisplayName,
} from "@/lib/display";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { getStateScorecardData, getStateTableData } from "@/services/api";
import type {
  StateVisScorecardResponse,
  StateVisTable,
} from "@/services/api.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/components/shared/BackButton";
import { ExpectationIcon } from "@/components/shared/ExpectationIcon";
import { PartyLabel } from "@/components/shared/PartyLabel";
import { ScoreMatrix } from "@/components/shared/ScoreMatrix";
import { StateScorecardGlossary } from "@/components/state/StateScorecardGlossary";
import { Term } from "@/lib/types";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export function StateScorecardView() {
  const navigate = useNavigate();
  const { state, slesId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const termParam = searchParams.get("term");
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [legislator, setLegislator] = useState<StateVisTable | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scorecard, setScorecard] = useState<StateVisScorecardResponse | null>(
    null
  );

  // Load initial data when component mounts
  useEffect(() => {
    if (!state || !slesId || !termParam) {
      toast.error("Missing required parameters");
      navigate("/state/table");
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Parse term from URL parameter (format: "2023-2024")
        const [startYear, endYear] = termParam.split("-").map(Number);

        if (isNaN(startYear) || isNaN(endYear)) {
          throw new Error("Invalid term format");
        }

        // Fetch table data with the state we already know from the URL
        const tableData = await getStateTableData(state!, startYear, endYear);

        const legislatorData = tableData.data.find(
          (l) => l.slesId === parseInt(slesId!)
        );

        if (!legislatorData) {
          throw new Error("Legislator not found");
        }

        // We already have the legislator data from the first API call
        const updatedLegislator = legislatorData;

        // No need for a second check since we already found the legislator

        // Fetch scorecard data
        const newScorecard = await getStateScorecardData(
          parseInt(slesId),
          startYear,
          endYear
        );

        setSelectedTerm({ startYear, endYear });
        setLegislator(updatedLegislator);
        setScorecard(newScorecard);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        toast.error("Failed to load legislator data");
        navigate("/state/table");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [slesId, termParam, navigate]);

  const handleTermChange = async (termString: string) => {
    if (!legislator || !scorecard || !slesId) return;

    setIsLoading(true);

    const term = scorecard.validStateTerms.find(
      (term) => getTermDisplayName(term) === termString
    );

    if (!term) {
      toast.error("Invalid term selected");
      setIsLoading(false);
      return;
    }

    const { startYear, endYear } = term;

    try {
      // Update URL to reflect the new term using query parameters
      const params = new URLSearchParams(searchParams);
      params.set("term", `${startYear}-${endYear}`);
      setSearchParams(params, { replace: true });

      // Fetch new table data first to get updated LES and rank
      const tableData = await getStateTableData(
        state!, // Use the state from URL params instead of legislator.state
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
        parseInt(slesId),
        startYear,
        endYear
      );

      // Only update state if both fetches succeed
      setSelectedTerm(term);
      setLegislator(updatedLegislator);
      setScorecard(newScorecard);
    } catch (err) {
      toast.error("Failed to load legislator data for the selected term");
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading || !legislator || !selectedTerm) {
    return <div className="p-8">Loading legislator data...</div>;
  }

  // Location text
  const locationText = getStateLocationText(legislator.district);

  // Get expectation and color
  const expectation = getExpectation(legislator.sles, legislator.benchmark);
  const expectationColor = getExpectationColor(expectation);

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate("/state/table")} />
      <div className="grid grid-areas-scorecard-mobile md:grid-areas-scorecard gap-6">
        {/* Legislator Info and Term Selection - Left column on desktop, top on mobile */}
        <div className="space-y-6 grid-in-scorecard-info">
          <Card className="shadow-none border-0">
            <CardHeader className="pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{legislator.name}</CardTitle>
                <div className="text-sm text-muted-foreground flex gap-8 font-mono">
                  <PartyLabel party={legislator.party} />
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
                      value={getTermDisplayName(selectedTerm)}
                      onValueChange={handleTermChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select term">
                          {selectedTerm &&
                            (() => {
                              const matchingTerm =
                                scorecard?.validStateTerms?.find(
                                  (term) =>
                                    term.startYear === selectedTerm.startYear &&
                                    term.endYear === selectedTerm.endYear
                                );

                              // Use the matching term if found, otherwise just show the display name
                              return matchingTerm
                                ? getValidTermDisplayName(matchingTerm)
                                : getTermDisplayName(selectedTerm);
                            })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {scorecard.validStateTerms.map((term) => (
                          <SelectItem
                            key={getTermDisplayName(term)}
                            value={getTermDisplayName(term)}
                          >
                            {getValidTermDisplayName(term)}
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
                      {legislator.benchmark === null
                        ? "—"
                        : legislator.benchmark.toFixed(3)}
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
        </div>

        {/* Score Matrix - Right column on desktop, middle on mobile */}
        {scorecard?.data?.overall && (
          <Card className="shadow-none border-0 grid-in-scorecard-matrix">
            <CardContent className="pt-6">
              <ScoreMatrix matrix={scorecard.data.overall} />
            </CardContent>
          </Card>
        )}

        {/* Glossary - Bottom on both desktop and mobile */}
        <div className="grid-in-scorecard-glossary">
          <StateScorecardGlossary />
        </div>
      </div>
    </div>
  );
}
