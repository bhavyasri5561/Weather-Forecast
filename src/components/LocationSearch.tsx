import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Bookmark, Check } from 'lucide-react';
import { LocationInfo } from '../types/weather';
import { searchLocations, PRESET_LOCATIONS } from '../services/weatherService';

interface LocationSearchProps {
  currentLocation: LocationInfo;
  onSelectLocation: (location: LocationInfo) => void;
  savedLocations: LocationInfo[];
  onToggleSaveLocation: (location: LocationInfo) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  currentLocation,
  onSelectLocation,
  savedLocations,
  onToggleSaveLocation
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const found = await searchLocations(query);
        setResults(found);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCurrentSaved = savedLocations.some(
    s => Math.abs(s.latitude - currentLocation.latitude) < 0.01 && 
         Math.abs(s.longitude - currentLocation.longitude) < 0.01
  );

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input Box */}
        <div ref={searchContainerRef} className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search city, state, or country (e.g. Tokyo, London, Berlin)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-9 pointer-events-none">
                <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (results.length > 0 || isSearching) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
              {results.map((loc, idx) => (
                <button
                  key={`${loc.latitude}-${loc.longitude}-${idx}`}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                        {loc.name}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                  </span>
                </button>
              ))}
              {results.length === 0 && !isSearching && query.trim().length >= 2 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching cities found. Try checking the spelling.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Current City Button */}
        <button
          type="button"
          onClick={() => onToggleSaveLocation(currentLocation)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-xl border transition-colors shrink-0 ${
            isCurrentSaved
              ? 'bg-sky-500/10 text-sky-300 border-sky-500/40 hover:bg-sky-500/20'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
          }`}
          title={isCurrentSaved ? 'Saved to Quick Access' : 'Save City to Quick Access'}
        >
          {isCurrentSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-sky-400" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save City</span>
            </>
          )}
        </button>
      </div>

      {/* Quick City Navigation bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400 scrollbar-none">
        <span className="text-slate-500 font-medium whitespace-nowrap shrink-0">Popular:</span>
        {PRESET_LOCATIONS.map((preset) => {
          const isActive =
            Math.abs(preset.latitude - currentLocation.latitude) < 0.05 &&
            Math.abs(preset.longitude - currentLocation.longitude) < 0.05;

          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onSelectLocation(preset)}
              className={`px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap shrink-0 font-medium ${
                isActive
                  ? 'bg-sky-500/20 text-sky-200 border-sky-500/60 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
