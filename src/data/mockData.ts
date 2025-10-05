import { AirQualityData, GlobePoint, AQIInfo } from '../types';

export const AQI_LEVELS: AQIInfo[] = [
  { level: 'good', color: '#00ff88', label: 'Good', range: [0, 50] },
  { level: 'moderate', color: '#ffff00', label: 'Moderate', range: [51, 100] },
  { level: 'unhealthy-sensitive', color: '#ff8800', label: 'Unhealthy for Sensitive', range: [101, 150] },
  { level: 'unhealthy', color: '#ff0000', label: 'Unhealthy', range: [151, 200] },
  { level: 'very-unhealthy', color: '#8800ff', label: 'Very Unhealthy', range: [201, 300] },
  { level: 'hazardous', color: '#800000', label: 'Hazardous', range: [301, 500] },
];

export const getAQIColor = (aqi: number): string => {
  const level = AQI_LEVELS.find(l => aqi >= l.range[0] && aqi <= l.range[1]);
  return level?.color || '#ff0000';
};

export const getAQILabel = (aqi: number): string => {
  const level = AQI_LEVELS.find(l => aqi >= l.range[0] && aqi <= l.range[1]);
  return level?.label || 'Unknown';
};

// Mock NASA TEMPO satellite data
export const mockAirQualityData: AirQualityData[] = [
  {
    id: 'toronto-001',
    location: {
      name: 'Toronto',
      coordinates: [-79.3832, 43.6532],
      country: 'Canada'
    },
    current: {
      aqi: 85,
      pm25: 25.3,
      pm10: 45.2,
      no2: 18.7,
      o3: 42.1,
      co: 1.2,
      so2: 5.8,
      timestamp: new Date().toISOString()
    },
    forecast: [
      {
        hour: '2024-01-01T12:00:00Z',
        aqi: 85,
        pm25: 25.3,
        pm10: 45.2,
        no2: 18.7,
        o3: 42.1,
        windSpeed: 12.5,
        windDirection: 245,
        temperature: 22,
        humidity: 65
      },
      {
        hour: '2024-01-01T13:00:00Z',
        aqi: 92,
        pm25: 28.1,
        pm10: 48.3,
        no2: 21.2,
        o3: 45.8,
        windSpeed: 14.2,
        windDirection: 250,
        temperature: 23,
        humidity: 62
      },
      {
        hour: '2024-01-01T14:00:00Z',
        aqi: 98,
        pm25: 31.2,
        pm10: 52.1,
        no2: 24.5,
        o3: 49.3,
        windSpeed: 16.8,
        windDirection: 255,
        temperature: 24,
        humidity: 58
      },
      {
        hour: '2024-01-01T15:00:00Z',
        aqi: 105,
        pm25: 35.8,
        pm10: 58.2,
        no2: 28.9,
        o3: 53.7,
        windSpeed: 18.3,
        windDirection: 260,
        temperature: 25,
        humidity: 55
      },
      {
        hour: '2024-01-01T16:00:00Z',
        aqi: 112,
        pm25: 38.9,
        pm10: 62.4,
        no2: 32.1,
        o3: 57.2,
        windSpeed: 19.5,
        windDirection: 265,
        temperature: 26,
        humidity: 52
      },
      {
        hour: '2024-01-01T17:00:00Z',
        aqi: 108,
        pm25: 36.2,
        pm10: 59.8,
        no2: 29.4,
        o3: 54.9,
        windSpeed: 17.2,
        windDirection: 270,
        temperature: 25,
        humidity: 54
      },
      {
        hour: '2024-01-01T18:00:00Z',
        aqi: 95,
        pm25: 32.1,
        pm10: 54.3,
        no2: 25.8,
        o3: 51.2,
        windSpeed: 15.6,
        windDirection: 275,
        temperature: 24,
        humidity: 57
      },
      {
        hour: '2024-01-01T19:00:00Z',
        aqi: 88,
        pm25: 28.7,
        pm10: 49.6,
        no2: 22.3,
        o3: 47.8,
        windSpeed: 13.9,
        windDirection: 280,
        temperature: 23,
        humidity: 61
      },
      {
        hour: '2024-01-01T20:00:00Z',
        aqi: 82,
        pm25: 25.9,
        pm10: 46.2,
        no2: 19.6,
        o3: 44.5,
        windSpeed: 12.1,
        windDirection: 285,
        temperature: 22,
        humidity: 64
      }
    ],
    alerts: [
      {
        id: 'alert-001',
        type: 'warning',
        message: 'Moderate air quality expected in Toronto within 6 hours',
        severity: 2,
        expiresAt: '2024-01-01T18:00:00Z'
      }
    ]
  },
  {
    id: 'london-001',
    location: {
      name: 'London',
      coordinates: [-0.1276, 51.5074],
      country: 'United Kingdom'
    },
    current: {
      aqi: 72,
      pm25: 18.9,
      pm10: 32.4,
      no2: 25.3,
      o3: 38.7,
      co: 0.9,
      so2: 8.2,
      timestamp: new Date().toISOString()
    },
    forecast: [
      {
        hour: '2024-01-01T12:00:00Z',
        aqi: 72,
        pm25: 18.9,
        pm10: 32.4,
        no2: 25.3,
        o3: 38.7,
        windSpeed: 8.5,
        windDirection: 180,
        temperature: 18,
        humidity: 75
      },
      {
        hour: '2024-01-01T13:00:00Z',
        aqi: 75,
        pm25: 20.1,
        pm10: 34.8,
        no2: 27.6,
        o3: 41.2,
        windSpeed: 9.2,
        windDirection: 185,
        temperature: 19,
        humidity: 73
      },
      {
        hour: '2024-01-01T14:00:00Z',
        aqi: 78,
        pm25: 21.8,
        pm10: 37.5,
        no2: 29.9,
        o3: 43.8,
        windSpeed: 10.1,
        windDirection: 190,
        temperature: 20,
        humidity: 71
      },
      {
        hour: '2024-01-01T15:00:00Z',
        aqi: 82,
        pm25: 23.4,
        pm10: 40.2,
        no2: 32.1,
        o3: 46.3,
        windSpeed: 11.3,
        windDirection: 195,
        temperature: 21,
        humidity: 69
      },
      {
        hour: '2024-01-01T16:00:00Z',
        aqi: 85,
        pm25: 25.1,
        pm10: 43.1,
        no2: 34.5,
        o3: 48.9,
        windSpeed: 12.7,
        windDirection: 200,
        temperature: 22,
        humidity: 67
      },
      {
        hour: '2024-01-01T17:00:00Z',
        aqi: 83,
        pm25: 24.3,
        pm10: 41.8,
        no2: 33.2,
        o3: 47.6,
        windSpeed: 11.8,
        windDirection: 205,
        temperature: 21,
        humidity: 68
      },
      {
        hour: '2024-01-01T18:00:00Z',
        aqi: 80,
        pm25: 22.7,
        pm10: 39.4,
        no2: 31.5,
        o3: 45.9,
        windSpeed: 10.9,
        windDirection: 210,
        temperature: 20,
        humidity: 70
      },
      {
        hour: '2024-01-01T19:00:00Z',
        aqi: 77,
        pm25: 21.2,
        pm10: 36.8,
        no2: 29.8,
        o3: 44.1,
        windSpeed: 10.2,
        windDirection: 215,
        temperature: 19,
        humidity: 72
      },
      {
        hour: '2024-01-01T20:00:00Z',
        aqi: 74,
        pm25: 19.6,
        pm10: 34.2,
        no2: 27.9,
        o3: 42.3,
        windSpeed: 9.5,
        windDirection: 220,
        temperature: 18,
        humidity: 74
      }
    ],
    alerts: []
  },
  {
    id: 'tokyo-001',
    location: {
      name: 'Tokyo',
      coordinates: [139.6917, 35.6895],
      country: 'Japan'
    },
    current: {
      aqi: 95,
      pm25: 28.4,
      pm10: 48.7,
      no2: 35.2,
      o3: 52.8,
      co: 1.8,
      so2: 12.5,
      timestamp: new Date().toISOString()
    },
    forecast: [
      {
        hour: '2024-01-01T12:00:00Z',
        aqi: 95,
        pm25: 28.4,
        pm10: 48.7,
        no2: 35.2,
        o3: 52.8,
        windSpeed: 15.2,
        windDirection: 90,
        temperature: 28,
        humidity: 55
      },
      {
        hour: '2024-01-01T13:00:00Z',
        aqi: 102,
        pm25: 31.7,
        pm10: 52.3,
        no2: 38.9,
        o3: 56.4,
        windSpeed: 17.8,
        windDirection: 95,
        temperature: 29,
        humidity: 52
      },
      {
        hour: '2024-01-01T14:00:00Z',
        aqi: 108,
        pm25: 35.1,
        pm10: 56.8,
        no2: 42.6,
        o3: 60.2,
        windSpeed: 20.3,
        windDirection: 100,
        temperature: 30,
        humidity: 49
      },
      {
        hour: '2024-01-01T15:00:00Z',
        aqi: 115,
        pm25: 38.9,
        pm10: 61.4,
        no2: 46.8,
        o3: 64.7,
        windSpeed: 22.1,
        windDirection: 105,
        temperature: 31,
        humidity: 46
      },
      {
        hour: '2024-01-01T16:00:00Z',
        aqi: 122,
        pm25: 42.3,
        pm10: 66.2,
        no2: 51.2,
        o3: 69.1,
        windSpeed: 23.5,
        windDirection: 110,
        temperature: 32,
        humidity: 43
      },
      {
        hour: '2024-01-01T17:00:00Z',
        aqi: 118,
        pm25: 40.1,
        pm10: 63.7,
        no2: 48.9,
        o3: 66.8,
        windSpeed: 21.8,
        windDirection: 115,
        temperature: 31,
        humidity: 45
      },
      {
        hour: '2024-01-01T18:00:00Z',
        aqi: 112,
        pm25: 37.2,
        pm10: 59.4,
        no2: 45.3,
        o3: 63.5,
        windSpeed: 19.6,
        windDirection: 120,
        temperature: 30,
        humidity: 48
      },
      {
        hour: '2024-01-01T19:00:00Z',
        aqi: 105,
        pm25: 34.8,
        pm10: 55.9,
        no2: 42.1,
        o3: 60.2,
        windSpeed: 17.4,
        windDirection: 125,
        temperature: 29,
        humidity: 51
      },
      {
        hour: '2024-01-01T20:00:00Z',
        aqi: 98,
        pm25: 31.5,
        pm10: 52.1,
        no2: 38.7,
        o3: 57.8,
        windSpeed: 15.9,
        windDirection: 130,
        temperature: 28,
        humidity: 54
      }
    ],
    alerts: [
      {
        id: 'alert-002',
        type: 'danger',
        message: 'High air pollution levels detected in Tokyo. Avoid outdoor activities.',
        severity: 4,
        expiresAt: '2024-01-01T20:00:00Z'
      }
    ]
  },
  {
    id: 'newyork-001',
    location: {
      name: 'New York',
      coordinates: [-74.0060, 40.7128],
      country: 'United States'
    },
    current: {
      aqi: 68,
      pm25: 16.2,
      pm10: 28.9,
      no2: 22.1,
      o3: 35.4,
      co: 0.8,
      so2: 6.3,
      timestamp: new Date().toISOString()
    },
    forecast: [
      {
        hour: '2024-01-01T12:00:00Z',
        aqi: 68,
        pm25: 16.2,
        pm10: 28.9,
        no2: 22.1,
        o3: 35.4,
        windSpeed: 11.2,
        windDirection: 300,
        temperature: 25,
        humidity: 60
      },
      {
        hour: '2024-01-01T13:00:00Z',
        aqi: 72,
        pm25: 17.8,
        pm10: 31.2,
        no2: 24.6,
        o3: 38.1,
        windSpeed: 12.8,
        windDirection: 305,
        temperature: 26,
        humidity: 58
      },
      {
        hour: '2024-01-01T14:00:00Z',
        aqi: 76,
        pm25: 19.4,
        pm10: 33.8,
        no2: 27.2,
        o3: 40.9,
        windSpeed: 14.5,
        windDirection: 310,
        temperature: 27,
        humidity: 56
      },
      {
        hour: '2024-01-01T15:00:00Z',
        aqi: 81,
        pm25: 21.7,
        pm10: 37.1,
        no2: 30.1,
        o3: 44.3,
        windSpeed: 16.2,
        windDirection: 315,
        temperature: 28,
        humidity: 54
      },
      {
        hour: '2024-01-01T16:00:00Z',
        aqi: 85,
        pm25: 23.9,
        pm10: 40.5,
        no2: 33.4,
        o3: 47.8,
        windSpeed: 17.8,
        windDirection: 320,
        temperature: 29,
        humidity: 52
      },
      {
        hour: '2024-01-01T17:00:00Z',
        aqi: 82,
        pm25: 22.3,
        pm10: 38.7,
        no2: 31.8,
        o3: 45.9,
        windSpeed: 16.5,
        windDirection: 325,
        temperature: 28,
        humidity: 53
      },
      {
        hour: '2024-01-01T18:00:00Z',
        aqi: 78,
        pm25: 20.6,
        pm10: 36.2,
        no2: 29.5,
        o3: 43.1,
        windSpeed: 15.1,
        windDirection: 330,
        temperature: 27,
        humidity: 55
      },
      {
        hour: '2024-01-01T19:00:00Z',
        aqi: 74,
        pm25: 18.9,
        pm10: 33.8,
        no2: 27.2,
        o3: 40.4,
        windSpeed: 13.7,
        windDirection: 335,
        temperature: 26,
        humidity: 57
      },
      {
        hour: '2024-01-01T20:00:00Z',
        aqi: 70,
        pm25: 17.1,
        pm10: 31.4,
        no2: 24.8,
        o3: 37.6,
        windSpeed: 12.3,
        windDirection: 340,
        temperature: 25,
        humidity: 59
      }
    ],
    alerts: []
  },
  {
    id: 'beijing-001',
    location: {
      name: 'Beijing',
      coordinates: [116.4074, 39.9042],
      country: 'China'
    },
    current: {
      aqi: 156,
      pm25: 58.7,
      pm10: 89.3,
      no2: 68.4,
      o3: 42.1,
      co: 2.8,
      so2: 18.9,
      timestamp: new Date().toISOString()
    },
    forecast: [
      {
        hour: '2024-01-01T12:00:00Z',
        aqi: 156,
        pm25: 58.7,
        pm10: 89.3,
        no2: 68.4,
        o3: 42.1,
        windSpeed: 8.5,
        windDirection: 45,
        temperature: 15,
        humidity: 45
      },
      {
        hour: '2024-01-01T13:00:00Z',
        aqi: 162,
        pm25: 62.1,
        pm10: 94.7,
        no2: 72.8,
        o3: 45.3,
        windSpeed: 9.8,
        windDirection: 50,
        temperature: 16,
        humidity: 43
      },
      {
        hour: '2024-01-01T14:00:00Z',
        aqi: 168,
        pm25: 65.9,
        pm10: 100.2,
        no2: 77.5,
        o3: 48.7,
        windSpeed: 11.2,
        windDirection: 55,
        temperature: 17,
        humidity: 41
      },
      {
        hour: '2024-01-01T15:00:00Z',
        aqi: 175,
        pm25: 70.3,
        pm10: 106.8,
        no2: 82.9,
        o3: 52.4,
        windSpeed: 12.7,
        windDirection: 60,
        temperature: 18,
        humidity: 39
      },
      {
        hour: '2024-01-01T16:00:00Z',
        aqi: 182,
        pm25: 74.8,
        pm10: 113.5,
        no2: 88.6,
        o3: 56.2,
        windSpeed: 14.1,
        windDirection: 65,
        temperature: 19,
        humidity: 37
      },
      {
        hour: '2024-01-01T17:00:00Z',
        aqi: 178,
        pm25: 72.4,
        pm10: 110.1,
        no2: 85.2,
        o3: 53.8,
        windSpeed: 13.3,
        windDirection: 70,
        temperature: 18,
        humidity: 38
      },
      {
        hour: '2024-01-01T18:00:00Z',
        aqi: 172,
        pm25: 69.1,
        pm10: 105.3,
        no2: 80.7,
        o3: 50.9,
        windSpeed: 12.5,
        windDirection: 75,
        temperature: 17,
        humidity: 40
      },
      {
        hour: '2024-01-01T19:00:00Z',
        aqi: 165,
        pm25: 65.8,
        pm10: 100.6,
        no2: 76.3,
        o3: 48.1,
        windSpeed: 11.8,
        windDirection: 80,
        temperature: 16,
        humidity: 42
      },
      {
        hour: '2024-01-01T20:00:00Z',
        aqi: 158,
        pm25: 62.2,
        pm10: 95.8,
        no2: 71.9,
        o3: 45.4,
        windSpeed: 11.1,
        windDirection: 85,
        temperature: 15,
        humidity: 44
      }
    ],
    alerts: [
      {
        id: 'alert-003',
        type: 'danger',
        message: 'Very unhealthy air quality in Beijing. Wear N95 masks and limit outdoor exposure.',
        severity: 5,
        expiresAt: '2024-01-02T12:00:00Z'
      }
    ]
  }
];

// Generate globe points from air quality data
export const generateGlobePoints = (): GlobePoint[] => {
  return mockAirQualityData.map(data => ({
    lat: data.location.coordinates[1],
    lng: data.location.coordinates[0],
    color: getAQIColor(data.current.aqi),
    aqi: data.current.aqi,
    size: Math.max(0.5, Math.min(3, data.current.aqi / 50)),
    location: data.location.name
  }));
};
