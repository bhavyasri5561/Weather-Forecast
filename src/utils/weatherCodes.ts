import { WeatherCategory } from '../types/weather';

export interface WeatherCodeDetails {
  description: string;
  category: WeatherCategory;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudSnow' | 'CloudLightning' | 'Snowflake';
}

export function parseWeatherCode(code: number): WeatherCodeDetails {
  switch (code) {
    case 0:
      return { description: 'Clear Sky', category: 'clear', iconName: 'Sun' };
    case 1:
      return { description: 'Mainly Clear', category: 'partly-cloudy', iconName: 'CloudSun' };
    case 2:
      return { description: 'Partly Cloudy', category: 'partly-cloudy', iconName: 'CloudSun' };
    case 3:
      return { description: 'Overcast', category: 'cloudy', iconName: 'Cloud' };
    case 45:
      return { description: 'Foggy', category: 'fog', iconName: 'CloudFog' };
    case 48:
      return { description: 'Depositing Rime Fog', category: 'fog', iconName: 'CloudFog' };
    case 51:
      return { description: 'Light Drizzle', category: 'rain', iconName: 'CloudDrizzle' };
    case 53:
      return { description: 'Moderate Drizzle', category: 'rain', iconName: 'CloudDrizzle' };
    case 55:
      return { description: 'Dense Drizzle', category: 'rain', iconName: 'CloudDrizzle' };
    case 56:
    case 57:
      return { description: 'Freezing Drizzle', category: 'snow', iconName: 'Snowflake' };
    case 61:
      return { description: 'Slight Rain', category: 'rain', iconName: 'CloudRain' };
    case 63:
      return { description: 'Moderate Rain', category: 'rain', iconName: 'CloudRain' };
    case 65:
      return { description: 'Heavy Rain', category: 'rain', iconName: 'CloudRain' };
    case 66:
    case 67:
      return { description: 'Freezing Rain', category: 'snow', iconName: 'Snowflake' };
    case 71:
      return { description: 'Slight Snow Fall', category: 'snow', iconName: 'CloudSnow' };
    case 73:
      return { description: 'Moderate Snow Fall', category: 'snow', iconName: 'CloudSnow' };
    case 75:
      return { description: 'Heavy Snow Fall', category: 'snow', iconName: 'CloudSnow' };
    case 77:
      return { description: 'Snow Grains', category: 'snow', iconName: 'Snowflake' };
    case 80:
      return { description: 'Slight Rain Showers', category: 'rain', iconName: 'CloudRain' };
    case 81:
      return { description: 'Moderate Rain Showers', category: 'rain', iconName: 'CloudRain' };
    case 82:
      return { description: 'Violent Rain Showers', category: 'rain', iconName: 'CloudRain' };
    case 85:
      return { description: 'Slight Snow Showers', category: 'snow', iconName: 'CloudSnow' };
    case 86:
      return { description: 'Heavy Snow Showers', category: 'snow', iconName: 'CloudSnow' };
    case 95:
      return { description: 'Thunderstorm', category: 'storm', iconName: 'CloudLightning' };
    case 96:
      return { description: 'Thunderstorm with Hail', category: 'storm', iconName: 'CloudLightning' };
    case 99:
      return { description: 'Heavy Thunderstorm with Hail', category: 'storm', iconName: 'CloudLightning' };
    default:
      return { description: 'Clear / Variable', category: 'clear', iconName: 'Sun' };
  }
}

export function convertTemp(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function convertSpeed(kmh: number, unit: 'kmh' | 'mph'): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  return Math.round(kmh);
}

export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function getHumidityComfort(humidity: number): { label: string; description: string; color: string } {
  if (humidity < 30) {
    return { label: 'Dry', description: 'Low moisture, dry air', color: 'text-amber-400' };
  }
  if (humidity <= 60) {
    return { label: 'Comfortable', description: 'Ideal human comfort zone', color: 'text-emerald-400' };
  }
  if (humidity <= 75) {
    return { label: 'Humid', description: 'Noticeable moisture in the air', color: 'text-sky-400' };
  }
  return { label: 'Very Humid', description: 'Muggy and dense atmosphere', color: 'text-indigo-400' };
}

export function getUvRisk(uv: number): { level: string; color: string } {
  if (uv <= 2) return { level: 'Low', color: 'text-emerald-400' };
  if (uv <= 5) return { level: 'Moderate', color: 'text-amber-400' };
  if (uv <= 7) return { level: 'High', color: 'text-orange-400' };
  if (uv <= 10) return { level: 'Very High', color: 'text-red-400' };
  return { level: 'Extreme', color: 'text-purple-400' };
}
