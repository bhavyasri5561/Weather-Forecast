import React from 'react';
import { TempUnit } from '../types/weather';
import { Navigation, Code2 } from 'lucide-react';

interface TopNavProps {
  activeTab: 'overview' | 'forecast' | 'radar' | 'api';
  setActiveTab: (tab: 'overview' | 'forecast' | 'radar' | 'api') => void;
  tempUnit: TempUnit;
  setTempUnit: (unit: TempUnit) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  tempUnit,
  setTempUnit,
  onUseCurrentLocation,
  isLoadingLocation,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="text-xl font-bold tracking-tight text-white hover:text-sky-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 rotate-45 inline-block" />
          <span>Atmosphere</span>
        </button>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Forecast
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'forecast'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5-Day Outlook
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'radar'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Satellite & Radar
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'text-sky-400 border-b-2 border-sky-400 font-semibold'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Spring Boot REST API</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action zone */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Unit Toggle Button */}
          <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setTempUnit('C')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                tempUnit === 'C'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => setTempUnit('F')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                tempUnit === 'F'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Current GPS location button */}
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLoadingLocation}
            title="Use Current Device Location"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Navigation className={`w-3.5 h-3.5 text-sky-400 ${isLoadingLocation ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Locate Me</span>
          </button>
        </div>
      </div>
    </header>
  );
};
