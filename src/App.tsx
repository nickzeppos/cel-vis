import { useState } from 'react';
import { FederalControlPanel } from '@/components/federal/FederalControlPanel';
import { StateControlPanel } from '@/components/state/StateControlPanel';
import { FederalView } from '@/components/federal/FederalView';
import { StateView } from '@/components/state/StateView';
import { ScorecardView } from '@/components/ScorecardView';
import { StateScorecard } from '@/components/state/StateScorecard';
import { getScoreComponentsData, getStateScoreComponentsData } from '@/services/api';
import type { TableRow, StateTableRow, ScoreComponentsResponse, StateScoreComponentsResponse } from '@/services/api';

function App() {
  const [level, setLevel] = useState<'federal' | 'state'>('federal');
  
  // Federal state
  const [congress, setCongress] = useState('118');
  const [chamber, setChamber] = useState<'house' | 'senate'>('house');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState('all');
  const [selectedLegislator, setSelectedLegislator] = useState<TableRow | null>(null);
  const [selectedLegislatorScorecard, setSelectedLegislatorScorecard] = useState<ScoreComponentsResponse | null>(null);

  // State level state
  const [selectedState, setSelectedState] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [stateChamber, setStateChamber] = useState<'upper' | 'lower'>('lower');
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [selectedStateLegislator, setSelectedStateLegislator] = useState<StateTableRow | null>(null);
  const [selectedStateScorecard, setSelectedStateScorecard] = useState<StateScoreComponentsResponse | null>(null);
  const [selectedStateTerm, setSelectedStateTerm] = useState('');

  const handleLevelChange = (newLevel: 'federal' | 'state') => {
    setLevel(newLevel);
    // Reset state when switching levels
    if (newLevel === 'state') {
      setSelectedLegislator(null);
      setSelectedLegislatorScorecard(null);
      setSelectedState('');
      setSelectedTerm('');
      setStateChamber('lower');
      setStateSearchTerm('');
    } else {
      setSelectedStateLegislator(null);
      setSelectedStateScorecard(null);
      setStateFilter('all');
      setSearchTerm('');
    }
  };

  const handleFederalLegislatorSelect = async (legislator: TableRow) => {
    try {
      const scorecard = await getScoreComponentsData(parseInt(congress), legislator.bioguide);
      setSelectedLegislatorScorecard(scorecard);
      setSelectedLegislator(legislator);
    } catch (err) {
      console.error('Failed to fetch scorecard data:', err);
      setSelectedLegislator(legislator);
    }
  };

  const handleStateLegislatorSelect = async (legislator: StateTableRow, term: string) => {
    try {
      const [startYear, endYear] = term.split('-').map(Number);
      const scorecard = await getStateScoreComponentsData(legislator.celSlesId, startYear, endYear);
      setSelectedStateScorecard(scorecard);
      setSelectedStateLegislator(legislator);
      setSelectedStateTerm(term);
    } catch (err) {
      console.error('Failed to fetch state scorecard data:', err);
      setSelectedStateLegislator(legislator);
    }
  };

  // Show federal scorecard
  if (selectedLegislator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
          <ScorecardView
            legislator={selectedLegislator}
            scorecard={selectedLegislatorScorecard}
            onBack={() => {
              setSelectedLegislator(null);
              setSelectedLegislatorScorecard(null);
            }}
          />
        </div>
      </div>
    );
  }

  // Show state scorecard
  if (selectedStateLegislator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
          <StateScorecard
            legislator={selectedStateLegislator}
            scorecard={selectedStateScorecard}
            initialTerm={selectedStateTerm}
            onBack={() => {
              setSelectedStateLegislator(null);
              setSelectedStateScorecard(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="flex gap-4">
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* Level Toggle */}
            <div className="p-1 bg-secondary rounded-lg">
              <div className="w-full grid grid-cols-2 gap-2 h-12 bg-secondary rounded-lg relative">
                {/* Sliding background */}
                <div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-accent rounded-md transition-transform duration-200 ease-in-out"
                  style={{
                    transform: `translateX(${level === 'state' ? 'calc(100% + 8px)' : '0'})`,
                  }}
                />
                
                {/* Toggle buttons */}
                <button
                  onClick={() => handleLevelChange('federal')}
                  className={`relative z-10 rounded-md transition-colors duration-200 font-medium bg-transparent ${
                    level === 'federal' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Federal
                </button>
                <button
                  onClick={() => handleLevelChange('state')}
                  className={`relative z-10 rounded-md transition-colors duration-200 font-medium bg-transparent ${
                    level === 'state' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  State
                </button>
              </div>
            </div>

            {/* Control Panel */}
            {level === 'federal' ? (
              <FederalControlPanel
                congress={congress}
                chamber={chamber}
                selectedState={stateFilter}
                selectedIssue={selectedIssue}
                onCongressChange={setCongress}
                onChamberChange={setChamber}
                onFilterChange={setStateFilter}
                onSearchChange={setSearchTerm}
                onIssueChange={setSelectedIssue}
              />
            ) : (
              <StateControlPanel
                selectedState={selectedState}
                selectedTerm={selectedTerm}
                selectedChamber={stateChamber}
                onStateSelect={setSelectedState}
                onTermChange={setSelectedTerm}
                onChamberChange={setStateChamber}
                onSearchChange={setStateSearchTerm}
              />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <h1 className="text-3xl font-bold">
              Legislative Effectiveness Scores
            </h1>

            {level === 'federal' ? (
              <FederalView
                congress={congress}
                chamber={chamber}
                stateFilter={stateFilter}
                searchTerm={searchTerm}
                selectedIssue={selectedIssue}
                onLegislatorSelect={handleFederalLegislatorSelect}
              />
            ) : (
              <StateView
                selectedState={selectedState}
                selectedTerm={selectedTerm}
                chamber={stateChamber}
                searchTerm={stateSearchTerm}
                onLegislatorSelect={handleStateLegislatorSelect}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;