import { Analytics } from '../types';

export const mockAnalytics: Analytics = {
  totalDonors: 10,
  activeDonors: 5,
  todayRequests: 5,
  pendingRequests: 3,
  successfulDonations: 16,
  criticalShortages: ['O-', 'AB-', 'B-'],
  monthlyTrends: [
    { month: 'Aug 2025', donations: 8, requests: 6 },
    { month: 'Sep 2025', donations: 12, requests: 10 },
    { month: 'Oct 2025', donations: 15, requests: 12 },
    { month: 'Nov 2025', donations: 18, requests: 15 },
    { month: 'Dec 2025', donations: 20, requests: 18 },
    { month: 'Jan 2026', donations: 16, requests: 14 },
    { month: 'Feb 2026', donations: 5, requests: 8 },
  ],
  emergencyResponseTime: 4.5, // hours
  donorEngagementRate: 65.5, // percentage
};
