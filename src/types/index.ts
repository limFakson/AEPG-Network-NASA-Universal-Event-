export interface AirQualityData {
  id: string;
  location: {
    name: string;
    coordinates: [number, number]; // [longitude, latitude]
    country: string;
  };
  current: {
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
    co: number;
    so2: number;
    timestamp: string;
  };
  forecast: {
    hour: string;
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
    windSpeed: number;
    windDirection: number;
    temperature: number;
    humidity: number;
  }[];
  alerts: {
    id: string;
    type: 'warning' | 'danger' | 'info';
    message: string;
    severity: number;
    expiresAt: string;
  }[];
}

export interface GlobePoint {
  lat: number;
  lng: number;
  color: string;
  aqi: number;
  size: number;
  location: string;
}

export type AQILevel = 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

export interface AQIInfo {
  level: AQILevel;
  color: string;
  label: string;
  range: [number, number];
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
}

export interface FireDetection {
  id: number;
  latitude: number;
  longitude: number;
  confidence: number;
  confidence_lvl: string;
  satellite: string;
  acq_datetime: string;
  daynight: string;
  geom_wkt: string;
  weather: WeatherParameter[];
  createdAt: string;
  updatedAt: string;
}

export interface WeatherParameter {
  id: number;
  fire_id: number;
  obs_time: string;
  parameter: string;
  value: number;
  units: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirePoint {
  lat: number;
  lng: number;
  color: string;
  size: number;
  confidence: number;
  satellite: string;
  timestamp: string;
  daynight: string;
}
