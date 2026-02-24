// Enhanced Hospital Details with operational parameters
export interface HospitalDetails {
  id: string;
  name: string;
  type: 'hospital' | 'blood-bank';
  hospitalId: string;
  zone: string;
  region: string;
  operationalStatus24x7: boolean;
  hospitalStatus: 'open' | 'limited' | 'closed';
  icuAvailable: boolean;
  ambulanceAvailable: boolean;
  icuBeds: number;
  ambulanceCount: number;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  lastVerified: string;
}

export const mockHospitalDetails: HospitalDetails[] = [
  {
    id: 'hospital-001',
    name: 'City General Hospital',
    type: 'hospital',
    hospitalId: 'hospital-001',
    zone: 'Zone-A',
    region: 'Manhattan',
    operationalStatus24x7: true,
    hospitalStatus: 'open',
    icuAvailable: true,
    ambulanceAvailable: true,
    icuBeds: 45,
    ambulanceCount: 8,
    contactPerson: 'Dr. Michael Johnson',
    phone: '+1234567891',
    email: 'hospital@example.com',
    city: 'New York',
    lastVerified: '2026-02-05T00:00:00Z',
  },
  {
    id: 'hospital-002',
    name: 'Red Cross Blood Bank',
    type: 'blood-bank',
    hospitalId: 'hospital-002',
    zone: 'Zone-B',
    region: 'Downtown LA',
    operationalStatus24x7: true,
    hospitalStatus: 'open',
    icuAvailable: false,
    ambulanceAvailable: false,
    icuBeds: 0,
    ambulanceCount: 0,
    contactPerson: 'Sarah Williams',
    phone: '+1234567892',
    email: 'redcross@bloodbank.com',
    city: 'Los Angeles',
    lastVerified: '2026-02-04T00:00:00Z',
  },
  {
    id: 'hospital-003',
    name: 'Mercy Medical Center',
    type: 'hospital',
    hospitalId: 'hospital-003',
    zone: 'Zone-A',
    region: 'Loop District',
    operationalStatus24x7: true,
    hospitalStatus: 'open',
    icuAvailable: true,
    ambulanceAvailable: true,
    icuBeds: 38,
    ambulanceCount: 6,
    contactPerson: 'Dr. Emily Davis',
    phone: '+1234567893',
    email: 'mercy.hospital@example.com',
    city: 'Chicago',
    lastVerified: '2026-02-06T00:00:00Z',
  },
  {
    id: 'hospital-004',
    name: 'St. Mary\'s Hospital',
    type: 'hospital',
    hospitalId: 'hospital-004',
    zone: 'Zone-C',
    region: 'Medical Center',
    operationalStatus24x7: true,
    hospitalStatus: 'limited',
    icuAvailable: true,
    ambulanceAvailable: true,
    icuBeds: 32,
    ambulanceCount: 5,
    contactPerson: 'Dr. Robert Martinez',
    phone: '+1234567903',
    email: 'stmarys@hospital.com',
    city: 'Houston',
    lastVerified: '2026-02-03T00:00:00Z',
  },
  {
    id: 'hospital-005',
    name: 'Phoenix Blood Center',
    type: 'blood-bank',
    hospitalId: 'hospital-005',
    zone: 'Zone-D',
    region: 'Central Phoenix',
    operationalStatus24x7: false,
    hospitalStatus: 'open',
    icuAvailable: false,
    ambulanceAvailable: false,
    icuBeds: 0,
    ambulanceCount: 0,
    contactPerson: 'Lisa Anderson',
    phone: '+1234567904',
    email: 'phoenix@bloodcenter.com',
    city: 'Phoenix',
    lastVerified: '2026-02-01T00:00:00Z',
  },
];
