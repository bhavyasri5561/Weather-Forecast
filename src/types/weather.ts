export type WeatherCategory = 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';

export interface LocationInfo {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  countryCode?: string;
  elevation?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  weatherCode: number;
  weatherDescription: string;
  weatherCategory: WeatherCategory;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  uvIndex: number;
  cloudCover: number;
  time: string;
}

export interface HourlyForecast {
  time: string;
  hourLabel: string;
  temperature: number;
  relativeHumidity: number;
  precipitationProbability: number;
  weatherCode: number;
  weatherDescription: string;
  weatherCategory: WeatherCategory;
  isDay: boolean;
  windSpeed: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  formattedDate: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  weatherCode: number;
  weatherDescription: string;
  weatherCategory: WeatherCategory;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  windSpeedMax: number;
}

export interface AirQuality {
  usAqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number;
  pm10: number;
  nitrogenDioxide?: number;
  ozone?: number;
}

export interface WeatherData {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[]; // 5-7 days
  airQuality?: AirQuality;
  rawJson: Record<string, unknown>;
  apiUrl: string;
  fetchedAt: string;
}

export type TempUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';
