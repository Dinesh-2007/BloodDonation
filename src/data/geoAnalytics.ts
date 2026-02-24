// Geo-Analytics and Location Intelligence Data
export interface CityEmergency {
  city: string;
  state: string;
  emergencyCountToday: number;
  emergencyCountTotal: number;
  zone: string;
  demand: 'low' | 'medium' | 'high' | 'critical';
}

export interface ZoneLoad {
  zone: string;
  hospitalCount: number;
  activeBeds: number;
  totalEmergencyRequests: number;
  averageResponseTime: number; // in hours
  criticalBloodGroups: string[];
  loadPercentage: number; // 0-100
}

export interface HeatZone {
  zone: string;
  demandLevel: 'low' | 'medium' | 'high' | 'critical';
  emergencyRequestsWeekly: number;
  populationServed: number;
  emergentBloodTypes: string[];
  lastUpdated: string;
}

export const mockCityEmergencies: CityEmergency[] = [
  {
    city: 'New York',
    state: 'NY',
    emergencyCountToday: 5,
    emergencyCountTotal: 47,
    zone: 'Zone-A',
    demand: 'high',
  },
  {
    city: 'Los Angeles',
    state: 'CA',
    emergencyCountToday: 3,
    emergencyCountTotal: 32,
    zone: 'Zone-B',
    demand: 'medium',
  },
  {
    city: 'Chicago',
    state: 'IL',
    emergencyCountToday: 4,
    emergencyCountTotal: 28,
    zone: 'Zone-A',
    demand: 'high',
  },
  {
    city: 'Houston',
    state: 'TX',
    emergencyCountToday: 2,
    emergencyCountTotal: 18,
    zone: 'Zone-C',
    demand: 'medium',
  },
  {
    city: 'Phoenix',
    state: 'AZ',
    emergencyCountToday: 1,
    emergencyCountTotal: 12,
    zone: 'Zone-D',
    demand: 'low',
  },
];

export const mockZoneLoads: ZoneLoad[] = [
  {
    zone: 'Zone-A',
    hospitalCount: 2,
    activeBeds: 83,
    totalEmergencyRequests: 75,
    averageResponseTime: 2.5,
    criticalBloodGroups: ['O-', 'AB-'],
    loadPercentage: 78,
  },
  {
    zone: 'Zone-B',
    hospitalCount: 1,
    activeBeds: 0,
    totalEmergencyRequests: 32,
    averageResponseTime: 3.2,
    criticalBloodGroups: ['B+', 'AB+'],
    loadPercentage: 65,
  },
  {
    zone: 'Zone-C',
    hospitalCount: 1,
    activeBeds: 32,
    totalEmergencyRequests: 18,
    averageResponseTime: 1.8,
    criticalBloodGroups: ['O+', 'A+'],
    loadPercentage: 45,
  },
  {
    zone: 'Zone-D',
    hospitalCount: 1,
    activeBeds: 0,
    totalEmergencyRequests: 12,
    averageResponseTime: 2.5,
    criticalBloodGroups: ['AB+'],
    loadPercentage: 32,
  },
];

export const mockHeatZones: HeatZone[] = [
  {
    zone: 'Zone-A',
    demandLevel: 'critical',
    emergencyRequestsWeekly: 34,
    populationServed: 2500000,
    emergentBloodTypes: ['O-', 'AB-', 'B-'],
    lastUpdated: '2026-02-07T08:30:00Z',
  },
  {
    zone: 'Zone-B',
    demandLevel: 'high',
    emergencyRequestsWeekly: 18,
    populationServed: 1800000,
    emergentBloodTypes: ['B+', 'AB+'],
    lastUpdated: '2026-02-07T07:45:00Z',
  },
  {
    zone: 'Zone-C',
    demandLevel: 'medium',
    emergencyRequestsWeekly: 9,
    populationServed: 900000,
    emergentBloodTypes: ['O+'],
    lastUpdated: '2026-02-07T06:20:00Z',
  },
  {
    zone: 'Zone-D',
    demandLevel: 'low',
    emergencyRequestsWeekly: 4,
    populationServed: 700000,
    emergentBloodTypes: [],
    lastUpdated: '2026-02-07T05:15:00Z',
  },
];
