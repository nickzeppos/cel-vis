import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFederalLocationText, getIssueDisplayName } from "@/lib/display";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { getScorecardData, getTableData } from "@/services/api";
import type { VisScorecardResponse, VisTable } from "@/services/api.types";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/components/shared/BackButton";
import { PartyLabel } from "@/components/shared/PartyLabel";
import { ScoreButton } from "@/components/shared/ScoreButton";
import { ScoreMatrix } from "@/components/shared/ScoreMatrix";
import { CongressSelector } from "@/components/federal/CongressSelector";
import { FederalScorecardGlossary } from "@/components/federal/FederalScorecardGlossary";
import { IssueCarousel } from "@/components/federal/IssueCarousel";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export function FederalScorecardView() {
  const navigate = useNavigate();
  const { bioguideId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get congress and issue from URL query parameters
  const congressParam = searchParams.get("congress");
  const issueParam = searchParams.get("issue");
  const [selectedIssue, setSelectedIssue] = useState<string>(
    issueParam || "overall"
  );
  const [selectedCongress, setSelectedCongress] = useState<number>(
    congressParam ? parseInt(congressParam) : 0
  );
  const [matrixHeight, setMatrixHeight] = useState<number>(0);
  const matrixRef = useRef<HTMLDivElement>(null);
  const issueListRef = useRef<HTMLDivElement>(null);
  const [legislator, setLegislator] = useState<VisTable | null>(null);
  const [scorecard, setScorecard] = useState<VisScorecardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load legislator data on initial render
  useEffect(() => {
    if (!bioguideId || !congressParam) {
      toast.error("Missing required parameters");
      navigate("/federal/table");
      return;
    }

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch table data to get legislator info
        const tableData = await getTableData(parseInt(congressParam));
        const legislatorData = tableData.data.find(
          (l) => l.bioguide === bioguideId
        );

        if (!legislatorData) {
          throw new Error("Legislator not found");
        }

        // Fetch scorecard data
        const newScorecard = await getScorecardData(
          parseInt(congressParam),
          bioguideId
        );

        setLegislator(legislatorData);
        setScorecard(newScorecard);
        setSelectedCongress(parseInt(congressParam));
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        toast.error("Failed to load legislator data");
        navigate("/federal/table");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [bioguideId, congressParam, navigate]);

  useEffect(() => {
    if (matrixRef.current) {
      setMatrixHeight(matrixRef.current.offsetHeight);
    }
  }, [scorecard]);

  // Update URL when selected issue or congress changes
  useEffect(() => {
    if (selectedIssue && selectedCongress) {
      const params = new URLSearchParams(searchParams);
      params.set("congress", selectedCongress.toString());
      
      if (selectedIssue !== "overall") {
        params.set("issue", selectedIssue);
      } else {
        params.delete("issue");
      }
      
      setSearchParams(params, { replace: true });
    }
  }, [selectedIssue, selectedCongress, searchParams, setSearchParams]);

  // Scroll to selected issue whenever it changes or when congress changes
  useEffect(() => {
    if (issueListRef.current && selectedIssue !== "overall") {
      const selectedButton = issueListRef.current.querySelector(
        `[data-issue="${selectedIssue}"]`
      );
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIssue, selectedCongress]);

  const handleCongressChange = async (congress: number) => {
    if (!bioguideId) return;
    
    setIsLoading(true);
    try {
      // Update selected congress state - URL will be updated by the effect
      setSelectedCongress(congress);
      
      // Fetch new table data for the selected congress
      const tableData = await getTableData(congress);
      const newLegislator = tableData.data.find(
        (l) => l.bioguide === bioguideId
      );

      if (!newLegislator) {
        throw new Error("Legislator not found in selected congress");
      }

      // Fetch new scorecard data
      const newScorecard = await getScorecardData(congress, bioguideId);

      setLegislator(newLegislator);
      setScorecard(newScorecard);

      // Only reset to overall if the selected issue doesn't exist in the new congress
      if (
        selectedIssue !== "overall" &&
        newLegislator.iles && 
        !(selectedIssue.toLowerCase() in newLegislator.iles)
      ) {
        setSelectedIssue("overall");
      }
    } catch (error) {
      console.error("Failed to load data for congress:", error);
      toast.error("Failed to load legislator data");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading || !legislator) {
    return <div className="p-8">Loading legislator data...</div>;
  }

  const locationText = getFederalLocationText(
    legislator.chamber,
    legislator.state,
    legislator.district
  );

  const expectation = getExpectation(legislator.les, legislator.benchmark);
  const expectationColor = getExpectationColor(expectation);

  const matrix =
    scorecard?.data.issues[selectedIssue.toLowerCase()] ||
    scorecard?.data.overall;

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate("/federal/table")} />
      <div className="grid grid-areas-scorecard-mobile md:grid-areas-scorecard gap-6">
        {/* Legislator Info and Issue Selection - Left column on desktop, top on mobile */}
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
                  {/* Desktop view - vertical scrolling */}
                  <div
                    ref={issueListRef}
                    className="hidden md:block space-y-2 overflow-y-auto pr-2"
                    style={{
                      maxHeight: matrixHeight ? `${matrixHeight - 180}px` : undefined,
                      paddingTop: "8px",
                      paddingBottom: "8px",
                    }}
                  >
                    {Object.entries(legislator.iles).map(([issue, score]) => (
                      <ScoreButton
                        key={`desktop-${issue}`}
                        title={getIssueDisplayName(issue)}
                        score={score}
                        isSelected={selectedIssue === issue}
                        onClick={() => setSelectedIssue(issue)}
                        data-issue={issue}
                      />
                    ))}
                  </div>
                  
                  {/* Mobile view - horizontal scrolling with square buttons */}
                  <div className="md:hidden">
                    <div className="grid grid-cols-1 max-w-full">
                      <IssueCarousel
                        issues={legislator.iles}
                        selectedIssue={selectedIssue}
                        onIssueSelect={setSelectedIssue}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score Matrix - Right column on desktop, middle on mobile */}
        {scorecard && matrix && (
          <Card className="shadow-none border-0 grid-in-scorecard-matrix">
            <CardContent className="md:pt-6 pt-3" ref={matrixRef}>
              <ScoreMatrix matrix={matrix} />
            </CardContent>
          </Card>
        )}

        {/* Glossary - Bottom on both layouts */}
        <div className="grid-in-scorecard-glossary">
          <FederalScorecardGlossary />
        </div>
      </div>
    </div>
  );
}
