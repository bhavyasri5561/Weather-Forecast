import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets, CloudRain } from 'lucide-react';
import { HourlyForecast, TempUnit } from '../types/weather';
import { convertTemp } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastBarProps {
  hourly: HourlyForecast[];
  tempUnit: TempUnit;
}

export const HourlyForecastBar: React.FC<HourlyForecastBarProps> = ({ hourly, tempUnit }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            24-Hour Timeline
          </h2>
          <p className="text-xs text-slate-400">
            Hourly temperature progression, precipitation risk, and atmospheric humidity
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth scrollbar-thin"
      >
        {hourly.map((hour, idx) => {
          const temp = convertTemp(hour.temperature, tempUnit);
          const hasRain = hour.precipitationProbability > 15;

          return (
            <div
              key={`${hour.time}-${idx}`}
              className={`flex flex-col items-center justify-between p-3.5 rounded-xl border min-w-[88px] text-center transition-all ${
                idx === 0
                  ? 'bg-sky-500/10 border-sky-500/40 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Hour Label */}
              <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
                {hour.hourLabel}
              </span>

              {/* Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  category={hour.weatherCategory}
                  isDay={hour.isDay}
                  className="w-7 h-7"
                />
              </div>

              {/* Temperature */}
              <span className="text-sm font-bold font-mono text-white tabular-nums">
                {temp}°
              </span>

              {/* Rain Chance or Humidity */}
              <div className="mt-2 text-[10px] flex flex-col items-center gap-1">
                {hasRain ? (
                  <span className="flex items-center gap-0.5 text-sky-400 font-mono font-medium">
                    <CloudRain className="w-2.5 h-2.5" />
                    {hour.precipitationProbability}%
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-slate-500 font-mono">
                    <Droplets className="w-2.5 h-2.5 text-slate-400" />
                    {hour.relativeHumidity}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
