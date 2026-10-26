import React from 'react';
import { 
  Droplets, 
  Wind, 
  Gauge, 
  Sun, 
  Eye, 
  Compass, 
  RefreshCw,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { WeatherData, TempUnit, SpeedUnit } from '../types/weather';
import { 
  convertTemp, 
  convertSpeed, 
  getHumidityComfort, 
  getUvRisk, 
  getWindDirectionLabel 
} from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherHeroProps {
  weather: WeatherData;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  weather,
  tempUnit,
  speedUnit,
  onRefresh,
  isRefreshing
}) => {
  const { current, location, daily, fetchedAt } = weather;
  const todayForecast = daily[0];

  const currentTemp = convertTemp(current.temperature, tempUnit);
  const feelsLikeTemp = convertTemp(current.apparentTemperature, tempUnit);
  const maxTemp = todayForecast ? convertTemp(todayForecast.temperatureMax, tempUnit) : currentTemp + 3;
  const minTemp = todayForecast ? convertTemp(todayForecast.temperatureMin, tempUnit) : currentTemp - 4;
  const windSpd = convertSpeed(current.windSpeed, speedUnit);
  const windDirection = getWindDirectionLabel(current.windDirection);
  const humidityComfort = getHumidityComfort(current.relativeHumidity);
  const uvRisk = getUvRisk(current.uvIndex);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl">
      {/* Background Ambient Sky Artwork with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/weather_sky_backdrop_1793036624008.jpg"
          alt="Atmospheric sky"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top opacity-30 brightness-75 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/60" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 space-y-6">
        {/* Top Header Row: Location, Time & Refresh Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {location.name}
              </h1>
              {location.countryCode && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  {location.countryCode}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
              <span>{[location.admin1, location.country].filter(Boolean).join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Updated {fetchedAt}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="self-start sm:self-center flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>

        {/* Main Temperature & Weather State Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Temp & Condition */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-md shadow-inner">
              <WeatherIcon 
                category={current.weatherCategory} 
                isDay={current.isDay} 
                className="w-16 h-16 sm:w-20 sm:h-20" 
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                  {currentTemp}
                </span>
                <span className="text-3xl font-light text-sky-400">°{tempUnit}</span>
              </div>
              
              <div className="text-lg font-semibold text-slate-200">
                {current.weatherDescription}
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 font-mono tabular-nums">
                <span>Feels like {feelsLikeTemp}°{tempUnit}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5 text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  H: {maxTemp}°{tempUnit}
                </span>
                <span className="flex items-center gap-0.5 text-sky-400">
                  <TrendingDown className="w-3.5 h-3.5" />
                  L: {minTemp}°{tempUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Metrics Strip: Focus on Humidity & Key Telemetry */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {/* Primary Highlight: Humidity Metric (Explicitly requested) */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  Humidity
                </span>
                <span className={`text-[11px] font-semibold ${humidityComfort.color}`}>
                  {humidityComfort.label}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {current.relativeHumidity}%
              </div>
              {/* Humidity Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, current.relativeHumidity)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 pt-0.5">
                {humidityComfort.description}
              </div>
            </div>

            {/* Wind Speed & Direction */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Wind className="w-4 h-4 text-teal-400" />
                  Wind
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {windDirection} ({current.windDirection}°)
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {windSpd} <span className="text-xs font-normal text-slate-400">{speedUnit}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Compass 
                  className="w-3.5 h-3.5 text-teal-400 transition-transform" 
                  style={{ transform: `rotate(${current.windDirection}deg)` }}
                />
                <span>Flowing towards {windDirection}</span>
              </div>
            </div>

            {/* Atmospheric Pressure */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  Pressure
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {Math.round(current.surfacePressure)} <span className="text-xs font-normal text-slate-400">hPa</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {current.surfacePressure > 1013 ? 'High pressure (Fair)' : 'Low pressure (Variable)'}
              </div>
            </div>

            {/* UV Index */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sun className="w-4 h-4 text-amber-400" />
                  UV Index
                </span>
                <span className={`text-[11px] font-semibold ${uvRisk.color}`}>
                  {uvRisk.level}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {current.uvIndex} <span className="text-xs font-normal text-slate-400">/ 11+</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {current.uvIndex > 5 ? 'Sun protection advised' : 'Low radiation risk'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
