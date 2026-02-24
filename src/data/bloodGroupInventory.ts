// Blood Bank Inventory - Blood Group wise
import { BloodGroup } from '../types';

export interface BloodGroupInventory {
  bloodGroup: BloodGroup;
  totalUnitsAvailable: number;
  totalUnitsReserved: number;
  criticalLevel: boolean;
  lowStockAlert: boolean;
  emergencyShortage: boolean;
  hospitals: {
    hospitalId: string;
    hospitalName: string;
    unitsAvailable: number;
    unitsReserved: number;
    expiryDate: string;
  }[];
}

export const mockBloodGroupInventory: BloodGroupInventory[] = [
  {
    bloodGroup: 'O+',
    totalUnitsAvailable: 145,
    totalUnitsReserved: 32,
    criticalLevel: false,
    lowStockAlert: false,
    emergencyShortage: false,
    hospitals: [
      {
        hospitalId: 'hospital-001',
        hospitalName: 'City General Hospital',
        unitsAvailable: 68,
        unitsReserved: 15,
        expiryDate: '2026-03-15T00:00:00Z',
      },
      {
        hospitalId: 'hospital-002',
        hospitalName: 'Red Cross Blood Bank',
        unitsAvailable: 45,
        unitsReserved: 12,
        expiryDate: '2026-03-10T00:00:00Z',
      },
      {
        hospitalId: 'hospital-003',
        hospitalName: 'Mercy Medical Center',
        unitsAvailable: 32,
        unitsReserved: 5,
        expiryDate: '2026-03-20T00:00:00Z',
      },
      {
        hospitalId: 'hospital-004',
        hospitalName: 'St. Mary\'s Hospital',
        unitsAvailable: 28,
        unitsReserved: 8,
        expiryDate: '2026-03-18T00:00:00Z',
      },
    ],
  },
  {
    bloodGroup: 'O-',
    totalUnitsAvailable: 58,
    totalUnitsReserved: 28,
    criticalLevel: true,
    lowStockAlert: true,
    emergencyShortage: false,
    hospitals: [
      {
        hospitalId: 'hospital-001',
        hospitalName: 'City General Hospital',
        unitsAvailable: 25,
        unitsReserved: 12,
        expiryDate: '2026-02-28T00:00:00Z',
      },
      {
        hospitalId: 'hospital-002',
        hospitalName: 'Red Cross Blood Bank',
        unitsAvailable: 18,
        unitsReserved: 10,
        expiryDate: '2026-02-25T00:00:00Z',
      },
      {
        hospitalId: 'hospital-003',
        hospitalName: 'Mercy Medical Center',
        unitsAvailable: 15,
        unitsReserved: 6,
        expiryDate: '2026-03-05T00:00:00Z',
      },
    ],
  },
  {
    bloodGroup: 'A+',
    totalUnitsAvailable: 112,
    totalUnitsReserved: 24,
    criticalLevel: false,
    lowStockAlert: false,
    emergencyShortage: false,
    hospitals: [
      {
        hospitalId: 'hospital-001',
        hospitalName: 'City General Hospital',
        unitsAvailable: 52,
        unitsReserved: 10,
        expiryDate: '2026-03-12T00:00:00Z',
      },
      {
        hospitalId: 'hospital-003',
        hospitalName: 'Mercy Medical Center',
        unitsAvailable: 35,
        unitsReserved: 8,
        expiryDate: '2026-03-18T00:00:00Z',
      },
      {
        hospitalId: 'hospital-004',
        hospitalName: 'St. Mary\'s Hospital',
        unitsAvailable: 25,
        unitsReserved: 6,
        expiryDate: '2026-03-22T00:00:00Z',
      },
    ],
  },
  {
    bloodGroup: 'A-',
    totalUnitsAvailable: 42,
    totalUnitsReserved: 16,
    criticalLevel: true,
    lowStockAlert: true,
    emergencyShortage: false,
    hospitals: [
      {
        hospitalId: 'hospital-001',
        hospitalName: 'City General Hospital',
        unitsAvailable: 22,
        unitsReserved: 8,
        expiryDate: '2026-03-08T00:00:00Z',
      },
      {
        hospitalId: 'hospital-002',
        hospitalName: 'Red Cross Blood Bank',
        unitsAvailable: 20,
        unitsReserved: 8,
        expiryDate: '2026-03-15T00:00:00Z',
      },
    ],
  },
  {
    bloodGroup: 'B+',
    totalUnitsAvailable: 98,
    totalUnitsReserved: 20,
    criticalLevel: false,
    lowStockAlert: false,
    emergencyShortage: false,
    hospitals: [
      {
        hospitalId: 'hospital-002',
        hospitalName: 'Red Cross Blood Bank',
        unitsAvailable: 42,
        unitsReserved: 10,
        expiryDate: '2026-03-14T00:00:00Z',
      },
      {
        hospitalId: 'hospital-003',
        hospitalName: 'Mercy Medical Center',
        unitsAvailable: 32,
        unitsReserved: 6,
        expiryDate: '2026-03-19T00:00:00Z',
      },
      {
        hospitalId: 'hospital-004',
        hospitalName: 'St. Mary\'s Hospital',
        unitsAvailable: 24,
        unitsReserved: 4,
        expiryDate: '2026-03-25T00:00:00Z',
      },
    ],
  },
  {
    bloodGroup: 'B-',
    totalUnitsAvailable: 35,
    totalUnitsReserved: 18,
    criticalLevel: true,
    lowStockAlert: true,
    emergencyShortage: true,
    hospitals: [
      {
        hospitalId: 'hospital-001',
        hospitalName: 'City General Hospital',
        unitsAvailable: 18,
        unitsReserved: 10,
        expiryDate: '2026-02-20T00:00:00Z',
      },
      {
        hospitalId: 'hospital-004',
        hospitalName: 'St. Mary\'s Hospital',
        unitsAvailable: 17,
        unitsReserved: 8,
        expiryDate: '2026-02-28T00:00:00Z',
      },
    ],
  },
  {
    bloodGroup: 'AB+',
    totalUnitsAvailable: 68,
    totalUnitsReserved: 15,
    criticalLevel: false,
    lowStockAlert: false,
    emergencyShortage: false,
    hospitals: [
      {
        hospitalId: 'hospital-002',
        hospitalName: 'Red Cross Blood Bank',
        unitsAvailable: 35,
        unitsReserved: 8,
        expiryDate: '2026-03-16T00:00:00Z',
      },
      {
        hospitalId: 'hospital-003',
        hospitalName: 'Mercy Medical Center',
        unitsAvailable: 22,
        unitsReserved: 5,
        expiryDate: '2026-03-21T00:00:00Z',
      },
      {
        hospitalId: 'hospital-005',
        hospitalName: 'Phoenix Blood Center',
        unitsAvailable: 11,
        unitsReserved: 2,
        expiryDate: '2026-03-24T00:00:00Z',
      },
    ],
  },
  {
    bloodGroup: 'AB-',
    totalUnitsAvailable: 28,
    totalUnitsReserved: 14,
    criticalLevel: true,
    lowStockAlert: true,
    emergencyShortage: true,
    hospitals: [
      {
        hospitalId: 'hospital-001',
        hospitalName: 'City General Hospital',
        unitsAvailable: 15,
        unitsReserved: 8,
        expiryDate: '2026-02-22T00:00:00Z',
      },
      {
        hospitalId: 'hospital-005',
        hospitalName: 'Phoenix Blood Center',
        unitsAvailable: 13,
        unitsReserved: 6,
        expiryDate: '2026-03-03T00:00:00Z',
      },
    ],
  },
];
