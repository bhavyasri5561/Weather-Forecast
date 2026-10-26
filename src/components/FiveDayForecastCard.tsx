import React, { useState } from 'react';
import { 
  CloudRain, 
  Sunrise, 
  Sunset, 
  Wind, 
  Sun, 
  ChevronDown, 
  ChevronUp,
  Droplets,
  Calendar
} from 'lucide-react';
import { DailyForecast, TempUnit, SpeedUnit } from '../types/weather';
import { convertTemp, convertSpeed } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface FiveDayForecastCardProps {
  daily: DailyForecast[];
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const FiveDayForecastCard: React.FC<FiveDayForecastCardProps> = ({
  daily,
  tempUnit,
  speedUnit
}) => {
  // Show 5 days (with toggle to see full 7 days)
  const [showFullWeek, setShowFullWeek] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const forecastDays = showFullWeek ? daily : daily.slice(0, 5);

  // Compute global min and max for temperature range bar
  const allMins = forecastDays.map((d) => d.temperatureMin);
  const allMaxs = forecastDays.map((d) => d.temperatureMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const rangeSpan = Math.max(1, globalMax - globalMin);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-5">
      {/* Header with Title & 5-Day / 7-Day Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {showFullWeek ? '7-Day Extended Forecast' : '5-Day Forecast'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Predictive temperature variance, precipitation chance, and astronomical cycle
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFullWeek(!showFullWeek)}
          className="self-start sm:self-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-sky-300 hover:text-sky-200 border border-slate-700/60 transition-colors"
        >
          {showFullWeek ? 'Show 5-Day View' : 'Extend to 7-Day View'}
        </button>
      </div>

      {/* Forecast Rows List */}
      <div className="divide-y divide-slate-800/60">
        {forecastDays.map((day, idx) => {
          const maxT = convertTemp(day.temperatureMax, tempUnit);
          const minT = convertTemp(day.temperatureMin, tempUnit);
          const windSpd = convertSpeed(day.windSpeedMax, speedUnit);
          const isExpanded = expandedIndex === idx;

          // Calculate percentage offsets for bar
          const minPercent = Math.max(0, Math.min(100, ((day.temperatureMin - globalMin) / rangeSpan) * 100));
          const maxPercent = Math.max(0, Math.min(100, ((day.temperatureMax - globalMin) / rangeSpan) * 100));
          const barWidth = Math.max(12, maxPercent - minPercent);

          return (
            <div key={day.date} className="py-3.5 first:pt-0 last:pb-0 transition-colors">
              <div 
                onClick={() => toggleExpand(idx)}
                className="flex items-center justify-between gap-3 cursor-pointer group hover:bg-slate-800/30 p-2 -mx-2 rounded-xl transition-colors"
              >
                {/* Day name & date */}
                <div className="w-24 sm:w-28 shrink-0">
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {day.dayName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {day.formattedDate}
                  </div>
                </div>

                {/* Weather icon & condition description */}
                <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                  <WeatherIcon category={day.weatherCategory} isDay={true} className="w-6 h-6 shrink-0" />
                  <span className="text-xs font-medium text-slate-300 truncate hidden sm:inline">
                    {day.weatherDescription}
                  </span>
                </div>

                {/* Precipitation Probability */}
                <div className="w-16 shrink-0 text-center">
                  {day.precipitationProbability > 0 ? (
                    <span className="flex items-center justify-center gap-1 text-xs font-mono font-medium text-sky-400 tabular-nums">
                      <CloudRain className="w-3 h-3 text-sky-400" />
                      {day.precipitationProbability}%
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-600">0%</span>
                  )}
                </div>

                {/* Temperature Range Bar & Tabular High/Low */}
                <div className="flex-1 max-w-xs flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 tabular-nums w-8 text-right">
                    {minT}°
                  </span>
                  
                  {/* Visual Bar */}
                  <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 rounded-full opacity-80"
                      style={{
                        left: `${minPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-100 tabular-nums w-8 text-left">
                    {maxT}°
                  </span>
                </div>

                {/* Expand Toggle */}
                <button
                  type="button"
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                  className="p-1 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/40 p-3 rounded-xl text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[11px] text-slate-400">Sunrise</div>
                      <div className="font-mono tabular-nums font-medium">{day.sunrise}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <div className="text-[11px] text-slate-400">Sunset</div>
                      <div className="font-mono tabular-nums font-medium">{day.sunset}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-400 shrink-0" />
                    <div>
                      <div className="text-[11px] text-slate-400">Max UV Index</div>
                      <div className="font-mono tabular-nums font-medium">{day.uvIndexMax} / 11+</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-400 shrink-0" />
                    <div>
                      <div className="text-[11px] text-slate-400">Max Gusts</div>
                      <div className="font-mono tabular-nums font-medium">{windSpd} {speedUnit}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
