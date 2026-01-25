import React from 'react';
import OpsGlobe from './components/OpsGlobe';
import OpsSidebar from './components/OpsSidebar';
import OpsPanelRight from './components/OpsPanelRight';
import OpsTimeline from './components/OpsTimeline';

import NarrativesPage from './components/NarrativesPage'; // Keeping as legacy or alternative view if needed
import NarrativeDetail from './components/NarrativeDetail';
import ThemeSelectionPage from './components/ThemeSelectionPage';
import FramesListPage from './components/FramesListPage';

import narrativeData from './data/narrative_data.json';

function App() {
  const [selectedLeadId, setSelectedLeadId] = React.useState(narrativeData.length > 0 ? narrativeData[0].narrative_id.toString() : null);
  const [selectedTheme, setSelectedTheme] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('dashboard'); // 'dashboard', 'themes', 'frames', 'detail'

  return (
    <div className="relative w-screen h-screen bg-[#050302] overflow-hidden text-stone-200 selection:bg-orange-500/30">

      {/* 1. Global Background Visualization (Centerpiece) */}
      <OpsGlobe />

      {/* 2. UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top Bar / Status - Strategic & Chic Design */}
        <div className="absolute top-0 left-0 right-0 p-8 flex items-start justify-between pointer-events-auto z-20">
          <div>
            <h1 className="font-display font-bold text-6xl tracking-[0.2em] text-white drop-shadow-2xl select-none leading-none">
              DHR<span className="text-orange-500">ISTI</span>
            </h1>
            <div className="flex items-center gap-2 mt-1 opacity-70">
              <div className="h-0.5 w-12 bg-orange-500"></div>
              <span className="text-[10px] font-mono tracking-widest text-orange-400 uppercase">Intelligence System</span>
            </div>
          </div>


        </div>

        {/* Level 1: Themes Selection */}
        {viewMode === 'themes' && (
          <ThemeSelectionPage
            onBack={() => setViewMode('dashboard')}
            onSelectTheme={(theme) => {
              setSelectedTheme(theme);
              setViewMode('frames');
            }}
          />
        )}

        {/* Level 2: Frames List */}
        {viewMode === 'frames' && selectedTheme && (
          <FramesListPage
            theme={selectedTheme}
            onBack={() => setViewMode('themes')}
            onSelectFrame={(narrativeId) => {
              setSelectedLeadId(narrativeId);
              setViewMode('detail');
            }}
          />
        )}

        {/* Level 3: Detail View */}
        {viewMode === 'detail' && (
          <NarrativeDetail
            narrativeId={selectedLeadId}
            onBack={() => setViewMode('frames')}
          />
        )}

        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <>
            <OpsSidebar
              activeId={selectedLeadId}
              onSelect={setSelectedLeadId}
              onViewAll={() => setViewMode('themes')}
            />
            <OpsPanelRight selectedId={selectedLeadId} />
          </>
        )}

      </div>

    </div>
  );
}

export default App;
