import React from 'react';
import { Wind, ShieldCheck, AlertCircle } from 'lucide-react';
import { AirQuality } from '../types/weather';

interface AirQualityCardProps {
  airQuality?: AirQuality;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  if (!airQuality) return null;

  const aqi = airQuality.usAqi;
  let color = 'text-emerald-400';
  let barColor = 'from-emerald-500 to-teal-400';
  let desc = 'Air quality is satisfactory, and air pollution poses little or no risk.';

  if (aqi > 150) {
    color = 'text-rose-400';
    barColor = 'from-rose-500 to-red-600';
    desc = 'Members of sensitive groups may experience health effects. Limit outdoor exposure.';
  } else if (aqi > 100) {
    color = 'text-orange-400';
    barColor = 'from-amber-500 to-orange-500';
    desc = 'Air quality is acceptable; however, sensitive people may experience minor breathing difficulty.';
  } else if (aqi > 50) {
    color = 'text-amber-400';
    barColor = 'from-teal-400 to-amber-400';
    desc = 'Air quality is acceptable for most individuals.';
  }

  const fillPercent = Math.min(100, Math.round((aqi / 300) * 100));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white">Air Quality Index (AQI)</h3>
        </div>
        <span className={`text-xs font-semibold ${color}`}>
          {airQuality.aqiStatus}
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-extrabold font-mono text-white tabular-nums">
          {aqi}
        </span>
        <span className="text-xs text-slate-400 font-mono">US AQI Standard</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${Math.max(5, fillPercent)}%` }}
        />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        {desc}
      </p>

      {/* Particulate breakdown */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">PM2.5 Particulate</div>
          <div className="text-sm font-bold font-mono text-slate-200 tabular-nums">
            {airQuality.pm25} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">PM10 Particulate</div>
          <div className="text-sm font-bold font-mono text-slate-200 tabular-nums">
            {airQuality.pm10} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </div>
        </div>
      </div>
    </div>
  );
};
