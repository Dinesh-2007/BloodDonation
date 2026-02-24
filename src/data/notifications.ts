import { Notification } from '../types';

export const mockNotifications: Notification[] = [
  // Admin Notifications
  {
    id: 'notif-001',
    userId: 'user-admin-001',
    type: 'low-stock',
    title: 'Critical Blood Shortage',
    message: 'O- blood type is critically low at City General Hospital (1 unit remaining)',
    read: false,
    createdAt: '2026-02-06T08:00:00Z',
    metadata: {
      bloodGroup: 'O-',
      hospitalId: 'hospital-001',
    },
  },
  {
    id: 'notif-002',
    userId: 'user-admin-001',
    type: 'low-stock',
    title: 'Low Stock Alert',
    message: 'AB- blood type below threshold at City General Hospital (1 unit)',
    read: false,
    createdAt: '2026-02-06T09:30:00Z',
    metadata: {
      bloodGroup: 'AB-',
      hospitalId: 'hospital-001',
    },
  },
  {
    id: 'notif-003',
    userId: 'user-admin-001',
    type: 'emergency',
    title: 'Emergency Blood Request',
    message: 'Emergency O+ blood request received - 2 units needed urgently',
    read: true,
    createdAt: '2026-02-06T08:30:00Z',
    metadata: {
      requestId: 'req-001',
      bloodGroup: 'O+',
    },
  },

  // Hospital Notifications
  {
    id: 'notif-004',
    userId: 'user-hospital-001',
    type: 'low-stock',
    title: 'Inventory Alert',
    message: 'O- blood inventory critical - only 1 unit available',
    read: false,
    createdAt: '2026-02-06T08:00:00Z',
    metadata: {
      bloodGroup: 'O-',
    },
  },
  {
    id: 'notif-005',
    userId: 'user-hospital-001',
    type: 'emergency',
    title: 'New Emergency Request',
    message: 'Emergency blood request received for O+ (2 units)',
    read: true,
    createdAt: '2026-02-06T08:30:00Z',
    metadata: {
      requestId: 'req-001',
      bloodGroup: 'O+',
    },
  },
  {
    id: 'notif-006',
    userId: 'user-hospital-001',
    type: 'request-update',
    title: 'Donor Matched',
    message: 'Donor matched for emergency O+ request',
    read: false,
    createdAt: '2026-02-06T08:45:00Z',
    metadata: {
      requestId: 'req-001',
    },
  },
  {
    id: 'notif-007',
    userId: 'user-hospital-002',
    type: 'low-stock',
    title: 'Stock Warning',
    message: 'B+ inventory approaching threshold - 18 units remaining',
    read: true,
    createdAt: '2026-02-06T07:00:00Z',
    metadata: {
      bloodGroup: 'B+',
    },
  },

  // Donor Notifications
  {
    id: 'notif-008',
    userId: 'user-donor-001',
    type: 'emergency',
    title: 'Emergency Blood Needed',
    message: 'O+ blood urgently needed at City General Hospital (2.5 km away)',
    read: false,
    createdAt: '2026-02-06T08:30:00Z',
    metadata: {
      requestId: 'req-001',
      bloodGroup: 'O+',
      hospitalId: 'hospital-001',
      distance: 2.5,
    },
  },
  {
    id: 'notif-009',
    userId: 'user-donor-001',
    type: 'eligibility',
    title: 'Now Eligible to Donate',
    message: 'You are now eligible to donate blood again!',
    read: true,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'notif-010',
    userId: 'user-donor-003',
    type: 'emergency',
    title: 'Emergency Alert',
    message: 'B+ blood critically needed at Mercy Medical Center (1.8 km away)',
    read: false,
    createdAt: '2026-02-06T14:20:00Z',
    metadata: {
      requestId: 'req-003',
      bloodGroup: 'B+',
      hospitalId: 'hospital-003',
      distance: 1.8,
    },
  },
  {
    id: 'notif-011',
    userId: 'user-donor-005',
    type: 'donation-reminder',
    title: 'Donation Reminder',
    message: 'Your universal O- blood type is always in demand. Consider donating soon!',
    read: false,
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'notif-012',
    userId: 'user-donor-006',
    type: 'request-update',
    title: 'Profile Verified',
    message: 'Your donor profile has been verified. Thank you for registering!',
    read: true,
    createdAt: '2026-02-01T12:00:00Z',
  },

  // Requester Notifications
  {
    id: 'notif-013',
    userId: 'user-requester-001',
    type: 'request-update',
    title: 'Donor Matched',
    message: 'A donor has been matched for your O+ blood request',
    read: false,
    createdAt: '2026-02-06T08:45:00Z',
    metadata: {
      requestId: 'req-001',
    },
  },
  {
    id: 'notif-014',
    userId: 'user-requester-001',
    type: 'emergency',
    title: 'Request Acknowledged',
    message: 'Your emergency blood request has been received and is being processed',
    read: true,
    createdAt: '2026-02-06T08:31:00Z',
    metadata: {
      requestId: 'req-001',
    },
  },
  {
    id: 'notif-015',
    userId: 'user-requester-002',
    type: 'request-update',
    title: 'Request Completed',
    message: 'Your blood request for AB+ has been successfully fulfilled',
    read: true,
    createdAt: '2026-02-05T16:30:00Z',
    metadata: {
      requestId: 'req-005',
    },
  },
  {
    id: 'notif-016',
    userId: 'user-requester-003',
    type: 'request-update',
    title: 'Donation In Progress',
    message: 'Donor is on the way to the hospital for your B+ blood request',
    read: false,
    createdAt: '2026-02-06T14:30:00Z',
    metadata: {
      requestId: 'req-003',
    },
  },
];
