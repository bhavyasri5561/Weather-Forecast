import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Snowflake,
  Moon,
  CloudMoon
} from 'lucide-react';
import { WeatherCategory } from '../types/weather';

interface WeatherIconProps {
  category: WeatherCategory;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  category, 
  isDay = true, 
  className = 'w-6 h-6', 
  size 
}) => {
  const iconProps = {
    className,
    size: size ?? undefined
  };

  switch (category) {
    case 'clear':
      return isDay ? (
        <Sun {...iconProps} className={`${className} text-amber-400`} />
      ) : (
        <Moon {...iconProps} className={`${className} text-indigo-300`} />
      );
    case 'partly-cloudy':
      return isDay ? (
        <CloudSun {...iconProps} className={`${className} text-amber-300`} />
      ) : (
        <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />
      );
    case 'cloudy':
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
    case 'fog':
      return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
    case 'rain':
      return <CloudRain {...iconProps} className={`${className} text-sky-400`} />;
    case 'storm':
      return <CloudLightning {...iconProps} className={`${className} text-yellow-400`} />;
    case 'snow':
      return <CloudSnow {...iconProps} className={`${className} text-blue-200`} />;
    default:
      return <Sun {...iconProps} className={`${className} text-amber-400`} />;
  }
};
