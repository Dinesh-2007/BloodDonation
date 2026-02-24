export interface EmergencyRequest {
  id: string;
  requestTime: string;
  emergencyType: string;
  patientName: string;
  patientLocation: string;
  bloodGroup: string;
  unitsRequired: number;
  urgency: 'critical' | 'high' | 'medium';
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'declined';
  contactNumber: string;
  hospitalName?: string;
  estimatedArrival?: string;
}

export const mockEmergencyRequests: EmergencyRequest[] = [
  {
    id: 'ER-2024-001',
    requestTime: '14:23',
    emergencyType: 'Road Accident',
    patientName: 'Rajesh Kumar',
    patientLocation: 'Andheri West, Mumbai',
    bloodGroup: 'O-',
    unitsRequired: 3,
    urgency: 'critical',
    status: 'pending',
    contactNumber: '+91-98765-43210',
  },
  {
    id: 'ER-2024-002',
    requestTime: '14:15',
    emergencyType: 'Surgery',
    patientName: 'Priya Sharma',
    patientLocation: 'Koramangala, Bengaluru',
    bloodGroup: 'B+',
    unitsRequired: 2,
    urgency: 'high',
    status: 'accepted',
    contactNumber: '+91-98765-43211',
    hospitalName: 'Apollo Specialty Hospital',
    estimatedArrival: '30 mins',
  },
  {
    id: 'ER-2024-003',
    requestTime: '13:45',
    emergencyType: 'Pregnancy Complication',
    patientName: 'Anjali Deshmukh',
    patientLocation: 'Connaught Place, New Delhi',
    bloodGroup: 'A+',
    unitsRequired: 2,
    urgency: 'critical',
    status: 'in-progress',
    contactNumber: '+91-98765-43212',
    hospitalName: 'Fortis Hospital',
    estimatedArrival: '15 mins',
  },
  {
    id: 'ER-2024-004',
    requestTime: '13:30',
    emergencyType: 'Trauma',
    patientName: 'Vikram Singh',
    patientLocation: 'T Nagar, Chennai',
    bloodGroup: 'AB+',
    unitsRequired: 1,
    urgency: 'medium',
    status: 'pending',
    contactNumber: '+91-98765-43213',
  },
  {
    id: 'ER-2024-005',
    requestTime: '12:50',
    emergencyType: 'Emergency Surgery',
    patientName: 'Sneha Chatterjee',
    patientLocation: 'Salt Lake, Kolkata',
    bloodGroup: 'O+',
    unitsRequired: 3,
    urgency: 'high',
    status: 'pending',
    contactNumber: '+91-98765-43214',
  },
  {
    id: 'ER-2024-006',
    requestTime: '11:20',
    emergencyType: 'Blood Loss',
    patientName: 'Amit Patel',
    patientLocation: 'Bandra East, Mumbai',
    bloodGroup: 'A-',
    unitsRequired: 2,
    urgency: 'critical',
    status: 'completed',
    contactNumber: '+91-98765-43215',
    hospitalName: 'Lilavati Hospital',
  },
];

export interface ResourceStatus {
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableICU: number;
  ventilators: number;
  availableVentilators: number;
}

export const mockResourceStatus: ResourceStatus = {
  totalBeds: 240,
  availableBeds: 45,
  icuBeds: 32,
  availableICU: 8,
  ventilators: 18,
  availableVentilators: 5,
};

export interface AmbulanceStatus {
  totalAmbulances: number;
  available: number;
  dispatched: number;
  underMaintenance: number;
}

export const mockAmbulanceStatus: AmbulanceStatus = {
  totalAmbulances: 12,
  available: 6,
  dispatched: 5,
  underMaintenance: 1,
};
