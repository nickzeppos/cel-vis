import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreMatrix } from "../ScoreMatrix";
import { ScorecardGlossary } from "../ScorecardGlossary";
import { getStateScoreComponentsData, getStateTableData } from "@/services/api";
import { ExpectationIcon } from "../ExpectationIcon";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import type { StateTableRow, StateScoreComponents, ValidStateTerm, StateScoreComponentsResponse } from "@/services/api";
import { toast } from "sonner";

interface StateScorecardProps {
  legislator: StateTableRow;
  scorecard: StateScoreComponentsResponse | null;
  initialTerm: string;
  onBack: () => void;
}

export function StateScorecard({ legislator: initialLegislator, scorecard: initialScorecard, initialTerm, onBack }: StateScorecardProps) {
  const [scorecard, setScorecard] = useState<StateScoreComponentsResponse | null>(initialScorecard);
  const [selectedTerm, setSelectedTerm] = useState<string>(initialTerm);
  const [legislator, setLegislator] = useState<StateTableRow>(initialLegislator);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Find the term details from validStateTerms
        const term = initialScorecard?.data.validStateTerms.find(
          t => `${t.startYear}-${t.endYear}` === initialTerm
        );

        if (!term) {
          toast.error("Invalid term selected");
          return;
        }
        
        // Fetch fresh table data
        const tableData = await getStateTableData(term.state, term.startYear, term.endYear);
        const currentLegislator = tableData.data.find(l => l.slesId === initialLegislator.slesId);
        
        if (!currentLegislator) {
          toast.error("Failed to load legislator data");
          return;
        }

        // Fetch fresh scorecard data
        const freshScorecard = await getStateScoreComponentsData(
          initialLegislator.slesId,
          term.startYear,
          term.endYear
        );

        setLegislator(currentLegislator);
        setScorecard(freshScorecard);
      } catch (err) {
        toast.error("Failed to load initial legislator data");
        console.error('Failed to fetch initial data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [initialLegislator.slesId, initialTerm, initialScorecard]);

  const handleTermChange = async (termString: string) => {
    setIsLoading(true);
    
    // Find the term details from validStateTerms
    const term = scorecard?.data.validStateTerms.find(
      t => `${t.startYear}-${t.endYear}` === termString
    );

    if (!term) {
      toast.error("Invalid term selected");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch new table data first to get updated LES and rank
      const tableData = await getStateTableData(term.state, term.startYear, term.endYear);
      const updatedLegislator = tableData.data.find(l => l.slesId === initialLegislator.slesId);
      
      if (!updatedLegislator) {
        toast.error("Legislator data not available for the selected term");
        return;
      }

      // Then fetch new scorecard data
      const newScorecard = await getStateScoreComponentsData(
        initialLegislator.slesId,
        term.startYear,
        term.endYear
      );

      // Only update state if both fetches succeed
      setSelectedTerm(termString);
      setLegislator(updatedLegislator);
      setScorecard(newScorecard);
    } catch (err) {
      toast.error("Failed to load legislator data for the selected term");
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const locationText = `District ${legislator.district}`;
  
  const partyBgColor = {
    'R': 'bg-red-100',
    'D': 'bg-blue-100',
    'I': 'bg-gray-100'
  }[legislator.party];

  // Sort terms in descending order
  const sortedTerms = scorecard?.data.validStateTerms.sort((a, b) => b.startYear - a.startYear) || [];

  // Helper function to format term display
  const formatTermDisplay = (term: ValidStateTerm) => {
    const chamberDisplay = term.chamber === 'upper' ? 'Upper' : 'Lower';
    return `${term.startYear}-${term.endYear} ${chamberDisplay}`;
  };

  // Helper function to create term value
  const getTermValue = (term: ValidStateTerm) => `${term.startYear}-${term.endYear}`;

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
              {scorecard?.data.validStateTerms && scorecard.data.validStateTerms.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">TERM</label>
                  <Select 
                    value={selectedTerm}
                    onValueChange={handleTermChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select term">
                        {selectedTerm && formatTermDisplay(
                          sortedTerms.find(term => getTermValue(term) === selectedTerm)!
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {sortedTerms.map(term => (
                        <SelectItem 
                          key={`${term.startYear}-${term.endYear}`} 
                          value={getTermValue(term)}
                        >
                          {formatTermDisplay(term)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-md">
                    <span className="font-medium">State Legislative Effectiveness Score</span>
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
                      {legislator.rank}/{legislator.total}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ScorecardGlossary />
        </div>

        {scorecard && (
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