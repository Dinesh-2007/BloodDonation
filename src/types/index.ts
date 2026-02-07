// User Roles
export type UserRole = 'admin' | 'hospital' | 'donor' | 'requester';

// Blood Types
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

// Location
export interface Location {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

// User
export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone: string;
  createdAt: string;
}

// Donor
export interface Donor {
  id: string;
  userId: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  weight: number;
  location: Location;
  lastDonationDate: string | null;
  nextEligibleDate: string | null;
  eligibilityStatus: 'eligible' | 'not-eligible' | 'pending';
  medicalStatus: 'approved' | 'rejected' | 'pending';
  contactVerified: boolean;
  preferredRadius: 5 | 10 | 25; // km
  totalDonations: number;
  createdAt: string;
}

// Blood Inventory
export interface BloodInventory {
  id: string;
  hospitalId: string;
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  unitsReserved: number;
  expiryDate: string;
  collectedDate: string;
  reorderThreshold: number;
  location: Location;
}

// Blood Request
export interface BloodRequest {
  id: string;
  requesterId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospitalName: string;
  hospitalId: string;
  location: Location;
  urgency: 'normal' | 'emergency';
  status: 'pending' | 'donor-matched' | 'in-progress' | 'completed' | 'cancelled';
  requestDate: string;
  fulfillmentDate: string | null;
  assignedDonorId: string | null;
  notes: string;
}

// Hospital / Blood Bank
export interface Hospital {
  id: string;
  userId: string;
  name: string;
  type: 'hospital' | 'blood-bank';
  location: Location;
  phone: string;
  email: string;
  licenseNumber: string;
  verificationStatus: 'approved' | 'pending' | 'rejected';
  emergencyContact: string;
  createdAt: string;
}

// Donation History
export interface DonationHistory {
  id: string;
  donorId: string;
  hospitalId: string;
  bloodGroup: BloodGroup;
  unitsDonated: number;
  donationDate: string;
  status: 'completed' | 'cancelled' | 'pending';
  requestId: string | null;
  notes: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'emergency' | 'low-stock' | 'eligibility' | 'request-update' | 'donation-reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    requestId?: string;
    bloodGroup?: BloodGroup;
    hospitalId?: string;
    distance?: number;
  };
}

// Analytics
export interface Analytics {
  totalDonors: number;
  activeDonors: number;
  todayRequests: number;
  pendingRequests: number;
  successfulDonations: number;
  criticalShortages: BloodGroup[];
  monthlyTrends: {
    month: string;
    donations: number;
    requests: number;
  }[];
  emergencyResponseTime: number; // in hours
  donorEngagementRate: number; // percentage
}

// Matching Result
export interface MatchingResult {
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroup;
  distance: number;
  eligibilityStatus: string;
  phone: string;
  matchScore: number;
}
