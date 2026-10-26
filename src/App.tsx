/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopNav } from './components/TopNav';
import { LocationSearch } from './components/LocationSearch';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { HourlyForecastBar } from './components/HourlyForecastBar';
import { FiveDayForecastCard } from './components/FiveDayForecastCard';
import { RadarView } from './components/RadarView';
import { AirQualityCard } from './components/AirQualityCard';
import { SpringBootApiModal } from './components/SpringBootApiModal';
import { 
  WeatherData, 
  LocationInfo, 
  TempUnit, 
  SpeedUnit 
} from './types/weather';
import { 
  fetchWeatherData, 
  PRESET_LOCATIONS 
} from './services/weatherService';
import { 
  CloudSun, 
  AlertTriangle, 
  RefreshCw, 
  Droplets, 
  Compass, 
  Wind,
  Layers,
  Thermometer
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'radar' | 'api'>('overview');
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kmh');
  
  // Default to New York
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(PRESET_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Saved locations
  const [savedLocations, setSavedLocations] = useState<LocationInfo[]>(() => {
    try {
      const saved = localStorage.getItem('atmosphere_saved_locations');
      return saved ? JSON.parse(saved) : [PRESET_LOCATIONS[0], PRESET_LOCATIONS[1], PRESET_LOCATIONS[2]];
    } catch {
      return [PRESET_LOCATIONS[0], PRESET_LOCATIONS[1]];
    }
  });

  const loadWeather = useCallback(async (location: LocationInfo, showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Failed to load weather data:', err);
      setErrorMessage(err?.message || 'Failed to fetch weather data. Please check your network connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(currentLocation);
  }, [currentLocation, loadWeather]);

  const handleSelectLocation = (loc: LocationInfo) => {
    setCurrentLocation(loc);
  };

  const handleToggleSaveLocation = (loc: LocationInfo) => {
    setSavedLocations((prev) => {
      const exists = prev.some(
        (s) => Math.abs(s.latitude - loc.latitude) < 0.01 && Math.abs(s.longitude - loc.longitude) < 0.01
      );
      let updated: LocationInfo[];
      if (exists) {
        updated = prev.filter(
          (s) => !(Math.abs(s.latitude - loc.latitude) < 0.01 && Math.abs(s.longitude - loc.longitude) < 0.01)
        );
      } else {
        updated = [...prev, loc];
      }
      try {
        localStorage.setItem('atmosphere_saved_locations', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const userLoc: LocationInfo = {
          name: 'My Device Location',
          country: '',
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
        };
        setCurrentLocation(userLoc);
        setIsLoadingLocation(false);
      },
      (err) => {
        console.warn('Geolocation failed or denied, using fallback preset:', err.message);
        setIsLoadingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30">
      {/* 1-Row 3-Zone Top Navigation Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tempUnit={tempUnit}
        setTempUnit={setTempUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLoadingLocation={isLoadingLocation}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search & Location Bar */}
        <section aria-label="City search and favorites">
          <LocationSearch
            currentLocation={currentLocation}
            onSelectLocation={handleSelectLocation}
            savedLocations={savedLocations}
            onToggleSaveLocation={handleToggleSaveLocation}
          />
        </section>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadWeather(currentLocation)}
              className="px-3 py-1 bg-rose-900/80 hover:bg-rose-800 rounded-lg text-white font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton State */}
        {isLoading && !weatherData && (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 rounded-2xl bg-slate-900/80 border border-slate-800" />
            <div className="h-32 rounded-2xl bg-slate-900/80 border border-slate-800" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 h-80 rounded-2xl bg-slate-900/80 border border-slate-800" />
              <div className="lg:col-span-4 h-80 rounded-2xl bg-slate-900/80 border border-slate-800" />
            </div>
          </div>
        )}

        {/* Populated State */}
        {weatherData && (
          <>
            {/* View Tab 1: Live Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 1. Main Current Weather Hero (Temperature & Humidity Highlight) */}
                <CurrentWeatherHero
                  weather={weatherData}
                  tempUnit={tempUnit}
                  speedUnit={speedUnit}
                  onRefresh={() => loadWeather(currentLocation, false)}
                  isRefreshing={isRefreshing}
                />

                {/* 2. 24-Hour Progression Timeline */}
                <HourlyForecastBar
                  hourly={weatherData.hourly}
                  tempUnit={tempUnit}
                />

                {/* 3. Split Grid: 5-Day Forecast & Air Quality/Atmosphere */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8">
                    <FiveDayForecastCard
                      daily={weatherData.daily}
                      tempUnit={tempUnit}
                      speedUnit={speedUnit}
                    />
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                    <AirQualityCard airQuality={weatherData.airQuality} />
                    
                    {/* Quick Spring Boot Integration Callout */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">
                          REST API Architecture
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400">
                          Live Open-Meteo
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Data parsed via Jackson DTOs into Spring Boot model classes with real-time temperature, humidity, and 5-day predictive intervals.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('api')}
                        className="w-full py-2 px-3 text-xs font-semibold text-sky-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors text-center"
                      >
                        Inspect Java Code & JSON Schema →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Tab 2: Dedicated 5-Day Forecast View */}
            {activeTab === 'forecast' && (
              <div className="space-y-6">
                <FiveDayForecastCard
                  daily={weatherData.daily}
                  tempUnit={tempUnit}
                  speedUnit={speedUnit}
                />
                
                <HourlyForecastBar
                  hourly={weatherData.hourly}
                  tempUnit={tempUnit}
                />
              </div>
            )}

            {/* View Tab 3: Doppler Radar & Satellite View */}
            {activeTab === 'radar' && (
              <div className="space-y-6">
                <RadarView location={weatherData.location} />
              </div>
            )}

            {/* View Tab 4: Spring Boot Java REST API & JSON Parsing Inspector */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <SpringBootApiModal weather={weatherData} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Clean quiet footer strictly adhering to Anti-Slop section 1.B */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Atmosphere Meteorological Service</span>
            <span aria-hidden="true">·</span>
            <span>Real-time REST API Integration</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Open-Meteo REST API</span>
            <span aria-hidden="true">·</span>
            <span>JSON Deserialization Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
