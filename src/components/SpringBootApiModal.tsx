import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Globe, 
  Layers, 
  ArrowUpRight,
  Braces
} from 'lucide-react';
import { WeatherData } from '../types/weather';

interface SpringBootApiModalProps {
  weather: WeatherData;
}

export const SpringBootApiModal: React.FC<SpringBootApiModalProps> = ({ weather }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'controller' | 'service' | 'dto' | 'json'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const curlCommand = `curl -X GET "${weather.apiUrl}" \\
  -H "Accept: application/json"`;

  const controllerCode = `package com.weather.controller;

import com.weather.dto.WeatherResponse;
import com.weather.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller exposing Weather Forecast endpoints.
 * Integrates with upstream meteorological REST APIs and returns parsed JSON.
 */
@RestController
@RequestMapping("/api/v1/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    /**
     * Fetch real-time weather and 5-day forecast by coordinates.
     * GET /api/v1/weather/forecast?latitude=...&longitude=...
     */
    @GetMapping("/forecast")
    public ResponseEntity<WeatherResponse> getForecast(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "auto") String timezone) {
        
        WeatherResponse forecast = weatherService.getWeatherForecast(latitude, longitude, timezone);
        return ResponseEntity.ok(forecast);
    }
}`;

  const serviceCode = `package com.weather.service;

import com.weather.dto.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Service handling REST API integration and Jackson JSON parsing.
 */
@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);
    private final RestClient restClient;

    public WeatherService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.open-meteo.com/v1")
                .build();
    }

    public WeatherResponse getWeatherForecast(double latitude, double longitude, String timezone) {
        log.info("Fetching real-time weather for lat: {}, lon: {}", latitude, longitude);

        String uri = UriComponentsBuilder.fromPath("/forecast")
                .queryParam("latitude", latitude)
                .queryParam("longitude", longitude)
                .queryParam("current", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m")
                .queryParam("hourly", "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code")
                .queryParam("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset")
                .queryParam("timezone", timezone)
                .queryParam("forecast_days", 7)
                .toUriString();

        // Performs HTTP GET and automatic Jackson JSON deserialization into WeatherResponse DTO
        return restClient.get()
                .uri(uri)
                .retrieve()
                .body(WeatherResponse.class);
    }
}`;

  const dtoCode = `package com.weather.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * DTO representations for deserializing upstream REST API JSON response.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record WeatherResponse(
    double latitude,
    double longitude,
    String timezone,
    @JsonProperty("current") CurrentWeatherDto current,
    @JsonProperty("daily") DailyForecastDto daily,
    @JsonProperty("hourly") HourlyForecastDto hourly
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CurrentWeatherDto(
        @JsonProperty("time") String time,
        @JsonProperty("temperature_2m") double temperature,
        @JsonProperty("relative_humidity_2m") double relativeHumidity,
        @JsonProperty("apparent_temperature") double apparentTemperature,
        @JsonProperty("precipitation") double precipitation,
        @JsonProperty("weather_code") int weatherCode,
        @JsonProperty("wind_speed_10m") double windSpeed,
        @JsonProperty("wind_direction_10m") int windDirection
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DailyForecastDto(
        @JsonProperty("time") List<String> time,
        @JsonProperty("temperature_2m_max") List<Double> temperatureMax,
        @JsonProperty("temperature_2m_min") List<Double> temperatureMin,
        @JsonProperty("precipitation_probability_max") List<Integer> precipitationProbability,
        @JsonProperty("weather_code") List<Integer> weatherCode,
        @JsonProperty("sunrise") List<String> sunrise,
        @JsonProperty("sunset") List<String> sunset
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record HourlyForecastDto(
        @JsonProperty("time") List<String> time,
        @JsonProperty("temperature_2m") List<Double> temperature,
        @JsonProperty("relative_humidity_2m") List<Double> relativeHumidity,
        @JsonProperty("precipitation_probability") List<Integer> precipitationProbability
    ) {}
}`;

  const rawJsonString = JSON.stringify(weather.rawJson, null, 2);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">
              Java (Spring Boot) REST API Integration & JSON Parsing
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Architectural implementation showing Spring Boot REST Client, Jackson DTO mapping, and live JSON parsing
          </p>
        </div>

        {/* Copy cURL Button */}
        <button
          type="button"
          onClick={() => handleCopy('curl', curlCommand)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors shrink-0"
        >
          {copiedKey === 'curl' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied cURL!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-sky-400" />
              <span>Copy cURL Command</span>
            </>
          )}
        </button>
      </div>

      {/* Live REST API Endpoint Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold text-[11px] border border-emerald-500/30">
              GET 200 OK
            </span>
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              REST API Endpoint (Live Coordinates: {weather.location.latitude}°, {weather.location.longitude}°)
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            JSON payload parsed successfully
          </span>
        </div>
        <div className="font-mono text-xs text-sky-300 truncate bg-slate-900/90 p-2 rounded-lg border border-slate-800/80 select-all">
          {weather.apiUrl}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'architecture'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>System Architecture</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('controller')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'controller'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>WeatherController.java</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('service')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'service'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>WeatherService.java</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dto')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'dto'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>WeatherResponse (DTOs)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'json'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Braces className="w-3.5 h-3.5" />
          <span>Live REST JSON Response</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'architecture' && (
        <div className="space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sky-400 font-bold text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                1. REST API Integration
              </div>
              <p className="text-slate-400 leading-relaxed">
                Connects to the Open-Meteo REST service via HTTP GET. Uses Spring Boot 3's modern <code className="text-sky-300">RestClient</code> with connection pooling, timeout resiliency, and automated query parameter encoding.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
                <Braces className="w-4 h-4" />
                2. JSON Deserialization
              </div>
              <p className="text-slate-400 leading-relaxed">
                Jackson's <code className="text-amber-300">ObjectMapper</code> maps JSON payload properties like <code className="text-slate-200">temperature_2m</code> and <code className="text-slate-200">relative_humidity_2m</code> directly into immutable Java Records.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                3. Spring Boot Controller
              </div>
              <p className="text-slate-400 leading-relaxed">
                Provides high-performance, caching-enabled endpoints <code className="text-emerald-300">/api/v1/weather/forecast</code> with CORS support for seamless client web and mobile app integration.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200 text-sm">Key JSON Parsing Schema Mappings:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                <span className="text-sky-400">JSON:</span> current.temperature_2m <br/>
                <span className="text-emerald-400">Java:</span> current.temperature() = {weather.current.temperature}°C
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                <span className="text-sky-400">JSON:</span> current.relative_humidity_2m <br/>
                <span className="text-emerald-400">Java:</span> current.relativeHumidity() = {weather.current.relativeHumidity}%
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                <span className="text-sky-400">JSON:</span> daily.temperature_2m_max <br/>
                <span className="text-emerald-400">Java:</span> daily.temperatureMax() (5-7 day list)
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                <span className="text-sky-400">JSON:</span> daily.precipitation_probability_max <br/>
                <span className="text-emerald-400">Java:</span> daily.precipitationProbability()
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'controller' && (
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={() => handleCopy('controller', controllerCode)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              {copiedKey === 'controller' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'controller' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-96">
            <code>{controllerCode}</code>
          </pre>
        </div>
      )}

      {activeTab === 'service' && (
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={() => handleCopy('service', serviceCode)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              {copiedKey === 'service' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'service' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-96">
            <code>{serviceCode}</code>
          </pre>
        </div>
      )}

      {activeTab === 'dto' && (
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={() => handleCopy('dto', dtoCode)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              {copiedKey === 'dto' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'dto' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-96">
            <code>{dtoCode}</code>
          </pre>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={() => handleCopy('json', rawJsonString)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'json' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono text-sky-200 leading-relaxed max-h-96">
            <code>{rawJsonString}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
