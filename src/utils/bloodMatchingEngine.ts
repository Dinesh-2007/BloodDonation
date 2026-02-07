import { BloodGroup, Location, Donor, BloodRequest, MatchingResult } from '../types';

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) *
      Math.cos(toRad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Check if donor is eligible based on last donation date
export function isDonorEligible(lastDonationDate: string | null): boolean {
  if (!lastDonationDate) return true;
  
  const lastDate = new Date(lastDonationDate);
  const today = new Date();
  const daysSinceLastDonation = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysSinceLastDonation >= 90; // 90 days gap required
}

// Calculate next eligible donation date
export function calculateNextEligibleDate(lastDonationDate: string | null): string | null {
  if (!lastDonationDate) return null;
  
  const lastDate = new Date(lastDonationDate);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 90);
  
  return nextDate.toISOString();
}

// Blood type compatibility matrix
const compatibilityMatrix: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

// Check blood group compatibility
export function isBloodGroupCompatible(donorBloodGroup: BloodGroup, recipientBloodGroup: BloodGroup): boolean {
  return compatibilityMatrix[recipientBloodGroup].includes(donorBloodGroup);
}

// Match donors to a blood request
export function matchDonorsToRequest(
  request: BloodRequest,
  donors: Donor[],
  maxDistance: number = 25
): MatchingResult[] {
  const matches: MatchingResult[] = [];
  
  donors.forEach(donor => {
    // Check blood group compatibility
    if (!isBloodGroupCompatible(donor.bloodGroup, request.bloodGroup)) {
      return;
    }
    
    // Calculate distance
    const distance = calculateDistance(donor.location, request.location);
    
    // Check if within range
    if (distance > maxDistance || distance > donor.preferredRadius) {
      return;
    }
    
    // Check eligibility
    const eligible = isDonorEligible(donor.lastDonationDate);
    
    // Calculate match score (higher is better)
    let matchScore = 100;
    matchScore -= distance * 2; // Closer is better
    if (!eligible) matchScore -= 30;
    if (donor.bloodGroup !== request.bloodGroup) matchScore -= 10; // Exact match is better
    if (donor.eligibilityStatus !== 'eligible') matchScore -= 20;
    if (!donor.contactVerified) matchScore -= 15;
    
    // Bonus for emergency and eligibility
    if (request.urgency === 'emergency' && eligible) matchScore += 20;
    
    matches.push({
      donorId: donor.id,
      donorName: donor.name,
      bloodGroup: donor.bloodGroup,
      distance,
      eligibilityStatus: eligible ? 'Eligible' : 'Not Eligible (90-day gap)',
      phone: `+123456789${matches.length}`, // Mock phone
      matchScore,
    });
  });
  
  // Sort by match score (descending)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// Format date to readable string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date with time
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Calculate days until expiry
export function daysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Get urgency color
export function getUrgencyColor(urgency: 'normal' | 'emergency'): string {
  return urgency === 'emergency' ? '#dc2626' : '#16a34a';
}

// Get status color
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    'donor-matched': '#3b82f6',
    'in-progress': '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444',
    eligible: '#10b981',
    'not-eligible': '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
  };
  return statusColors[status] || '#6b7280';
}
