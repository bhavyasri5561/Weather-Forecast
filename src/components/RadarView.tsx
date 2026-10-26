import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Layers, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { LocationInfo } from '../types/weather';

interface RadarViewProps {
  location: LocationInfo;
}

export const RadarView: React.FC<RadarViewProps> = ({ location }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameIndex, setFrameIndex] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(1);

  const frames = [
    { label: '-45 min', time: '10:00' },
    { label: '-30 min', time: '10:15' },
    { label: '-15 min', time: '10:30' },
    { label: 'Live (Now)', time: '10:45' }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Doppler Weather Radar & Satellite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Atmospheric radar reflectivity, cloud albedo, and precipitation cell trajectories
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-sky-500 inline-block" />
            <span>Light Rain</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-cyan-400 inline-block" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-amber-400 inline-block" />
            <span>Heavy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-purple-400 inline-block" />
            <span>Snow / Mix</span>
          </div>
        </div>
      </div>

      {/* Radar Map Canvas Container */}
      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
        {/* Radar Image Asset with fallback */}
        <img
          src="/src/assets/images/weather_satellite_radar_1793036624403.jpg"
          alt="Doppler Weather Radar Simulation"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        />

        {/* Dynamic Frame Radar Scan sweep line simulation */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-sky-500/5 to-transparent mix-blend-screen" />
        
        {/* Location Target Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-sky-400/60 animate-ping absolute" />
            <div className="w-4 h-4 rounded-full bg-sky-500/40 border border-sky-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="absolute -top-7 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-[11px] font-mono text-white whitespace-nowrap shadow-md">
              {location.name}
            </div>
          </div>
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 z-20">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg shadow-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg shadow-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge overlay */}
        <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-white">{location.name}</span>
          <span className="text-slate-500">|</span>
          <span className="font-mono tabular-nums text-slate-400">
            {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°W
          </span>
        </div>
      </div>

      {/* Radar Timeline Playback Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Loop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play Radar Loop</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setFrameIndex(0)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Frames Segmented Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {frames.map((frame, idx) => (
            <button
              key={frame.label}
              type="button"
              onClick={() => {
                setFrameIndex(idx);
                setIsPlaying(false);
              }}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                frameIndex === idx
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {frame.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
