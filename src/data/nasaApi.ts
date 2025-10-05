// NASA AEPG Network Server API integration
const NASA_API_BASE_URL = 'https://your-nasa-api-server.com'; // Replace with actual URL

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
  weather: WeatherData[];
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
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

export interface PowerData {
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

// API Service Class
export class NASAApiService {
  private baseUrl: string;

  constructor(baseUrl: string = NASA_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Fetch fire detection data
  async getFireDetections(filter?: string): Promise<FireDetection[]> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        params.append('filter', filter);
      }

      const response = await fetch(`${this.baseUrl}/api/detect/fire?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching fire detections:', error);
      // Return mock data if API fails
      return this.getMockFireDetections();
    }
  }

  // Fetch power data for specific fire
  async getPowerData(fireId?: number): Promise<PowerData[]> {
    try {
      const params = new URLSearchParams();
      if (fireId) {
        params.append('fire', fireId.toString());
      }

      const response = await fetch(`${this.baseUrl}/api/detect/power?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching power data:', error);
      // Return mock data if API fails
      return this.getMockPowerData();
    }
  }

  // Mock data for development/fallback
  private getMockFireDetections(): FireDetection[] {
    return [
      {
        id: 1,
        latitude: 34.0522,
        longitude: -118.2437,
        confidence: 85,
        confidence_lvl: "high",
        satellite: "MODIS",
        acq_datetime: new Date().toISOString(),
        daynight: "day",
        geom_wkt: "POINT(-118.2437 34.0522)",
        weather: [
          {
            id: 1,
            fire_id: 1,
            obs_time: new Date().toISOString(),
            parameter: "wind_speed",
            value: 12.5,
            units: "m/s",
            source: "NASA_POWER",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            fire_id: 1,
            obs_time: new Date().toISOString(),
            parameter: "relative_humidity",
            value: 45,
            units: "%",
            source: "NASA_POWER",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        latitude: 37.7749,
        longitude: -122.4194,
        confidence: 72,
        confidence_lvl: "medium",
        satellite: "VIIRS",
        acq_datetime: new Date(Date.now() - 3600000).toISOString(),
        daynight: "night",
        geom_wkt: "POINT(-122.4194 37.7749)",
        weather: [
          {
            id: 3,
            fire_id: 2,
            obs_time: new Date(Date.now() - 3600000).toISOString(),
            parameter: "temperature",
            value: 28.5,
            units: "C",
            source: "NASA_POWER",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 3,
        latitude: 40.7128,
        longitude: -74.0060,
        confidence: 95,
        confidence_lvl: "high",
        satellite: "MODIS",
        acq_datetime: new Date(Date.now() - 7200000).toISOString(),
        daynight: "day",
        geom_wkt: "POINT(-74.0060 40.7128)",
        weather: [
          {
            id: 4,
            fire_id: 3,
            obs_time: new Date(Date.now() - 7200000).toISOString(),
            parameter: "air_pressure",
            value: 1013.25,
            units: "hPa",
            source: "NASA_POWER",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            updatedAt: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  private getMockPowerData(): PowerData[] {
    return [
      {
        id: 1,
        fire_id: 1,
        obs_time: new Date().toISOString(),
        parameter: "solar_irradiance",
        value: 850.5,
        units: "W/m²",
        source: "NASA_POWER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        fire_id: 1,
        obs_time: new Date().toISOString(),
        parameter: "uv_index",
        value: 8.2,
        units: "index",
        source: "NASA_POWER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

// Create singleton instance
export const nasaApi = new NASAApiService();

// Utility functions for processing fire data
export const processFireDataForGlobe = (fireDetections: FireDetection[]) => {
  return fireDetections.map(fire => ({
    lat: fire.latitude,
    lng: fire.longitude,
    color: getFireColor(fire.confidence),
    size: Math.max(0.5, Math.min(2, fire.confidence / 50)),
    confidence: fire.confidence,
    satellite: fire.satellite,
    timestamp: fire.acq_datetime,
    daynight: fire.daynight
  }));
};

export const getFireColor = (confidence: number): string => {
  if (confidence >= 90) return '#ff0000'; // High confidence - Red
  if (confidence >= 70) return '#ff8800'; // Medium-high - Orange
  if (confidence >= 50) return '#ffff00'; // Medium - Yellow
  return '#ff8800'; // Default to orange
};

export const getFireSize = (confidence: number): number => {
  return Math.max(0.5, Math.min(3, confidence / 30));
};

export const calculateAirQualityImpact = (fireDetections: FireDetection[]) => {
  // Calculate potential air quality impact based on fire data
  const totalFires = fireDetections.length;
  const highConfidenceFires = fireDetections.filter(f => f.confidence >= 80).length;
  
  let aqiImpact = 0;
  
  if (totalFires > 0) {
    const avgConfidence = fireDetections.reduce((sum, fire) => sum + fire.confidence, 0) / totalFires;
    const highConfidenceRatio = highConfidenceFires / totalFires;
    
    // Calculate AQI impact (0-100 additional points)
    aqiImpact = Math.min(100, (avgConfidence * 0.5) + (highConfidenceRatio * 30));
  }
  
  return {
    totalFires,
    highConfidenceFires,
    aqiImpact: Math.round(aqiImpact),
    riskLevel: aqiImpact > 50 ? 'high' : aqiImpact > 25 ? 'medium' : 'low'
  };
};
