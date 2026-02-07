import React from 'react';
import { Heart, MapPin, Calendar, CheckCircle, Bell } from 'lucide-react';
import { Card, Table, Badge, Button } from '../common/UIComponents';
import { mockDonationHistory } from '../../data/donationHistory';
import { mockNotifications } from '../../data/notifications';
import { mockBloodRequests } from '../../data/bloodRequests';
import { mockHospitals } from '../../data/hospitals';
import { mockDonors } from '../../data/donors';
import { calculateDistance, formatDate, formatDateTime } from '../../utils/bloodMatchingEngine';

interface DonorDashboardProps {
  userId: string;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ userId }) => {
  // Find donor info
  const donor = mockDonors.find(d => d.userId === userId);
  if (!donor) return <div>Donor not found</div>;

  // Get donation history for this donor
  const donations = mockDonationHistory.filter(d => d.donorId === donor.id);
  
  // Get notifications for this user
  const notifications = mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Find emergency requests that match this donor
  const emergencyRequests = mockBloodRequests.filter(req => {
    if (req.urgency !== 'emergency' || req.status !== 'pending') return false;
    const distance = calculateDistance(donor.location, req.location);
    return distance <= donor.preferredRadius && req.bloodGroup === donor.bloodGroup;
  });

  const nextEligibleDate = donor.nextEligibleDate 
    ? new Date(donor.nextEligibleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Ready to donate!';

  return (
    <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          Welcome, {donor.name}!
        </h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>Thank you for being a life-saving donor</p>
      </div>

      {/* Emergency Alert Banner */}
      {emergencyRequests.length > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '2px solid #dc2626',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Bell size={24} color="#dc2626" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#991b1b', fontSize: '18px', marginBottom: '8px' }}>
                🚨 Emergency Blood Needed!
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d', marginBottom: '12px' }}>
                {emergencyRequests.length} emergency request(s) match your blood type and location
              </p>
              {emergencyRequests.slice(0, 2).map(req => {
                const hospital = mockHospitals.find(h => h.id === req.hospitalId);
                const distance = calculateDistance(donor.location, req.location);
                return (
                  <div key={req.id} style={{
                    backgroundColor: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>
                          {req.bloodGroup} - {req.unitsRequired} unit(s) needed
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                          📍 {hospital?.name} ({distance} km away)
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="sm" variant="primary">Accept</Button>
                        <Button size="sm" variant="secondary">Decline</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <Card
          title="Blood Group"
          value={donor.bloodGroup}
          icon={<Heart size={24} />}
          color="#dc2626"
        />
        <Card
          title="Total Donations"
          value={donor.totalDonations}
          icon={<CheckCircle size={24} />}
          color="#10b981"
        />
        <Card
          title="Eligibility Status"
          value={donor.eligibilityStatus}
          icon={<Calendar size={24} />}
          color={donor.eligibilityStatus === 'eligible' ? '#10b981' : '#f59e0b'}
        />
        <Card
          title="Next Eligible Date"
          value={donor.eligibilityStatus === 'eligible' ? 'Now!' : nextEligibleDate}
          icon={<Calendar size={24} />}
          color="#3b82f6"
        />
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        
        {/* Donor Profile */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
            Your Profile
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Full Name</p>
                <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{donor.name}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Blood Group</p>
                <p style={{ margin: 0, fontWeight: '600', color: '#dc2626' }}>{donor.bloodGroup}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Age</p>
                <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{donor.age} years</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Weight</p>
                <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{donor.weight} kg</p>
              </div>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Location</p>
              <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>
                📍 {donor.location.city}, {donor.location.state}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Preferred Donation Radius</p>
              <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{donor.preferredRadius} km</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Last Donation</p>
              <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>
                {donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'No donations yet'}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Medical Status</p>
              <Badge color={donor.medicalStatus === 'approved' ? '#10b981' : '#f59e0b'}>
                {donor.medicalStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Donation History
          </h2>
          {donations.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              No donations yet. Thank you for registering!
            </p>
          ) : (
            <Table
              headers={['Date', 'Hospital', 'Units', 'Status']}
              data={donations.slice(0, 5).map(donation => {
                const hospital = mockHospitals.find(h => h.id === donation.hospitalId);
                return [
                  formatDate(donation.donationDate),
                  hospital?.name.substring(0, 25) || 'N/A',
                  donation.unitsDonated,
                  <Badge color={donation.status === 'completed' ? '#10b981' : '#f59e0b'}>
                    {donation.status}
                  </Badge>,
                ];
              })}
            />
          )}
        </div>

        {/* Notifications */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Recent Notifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.slice(0, 5).map(notif => (
              <div key={notif.id} style={{
                padding: '12px',
                backgroundColor: notif.read ? '#f9fafb' : '#eff6ff',
                borderRadius: '6px',
                border: `1px solid ${notif.read ? '#e5e7eb' : '#bfdbfe'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#111827', flex: 1 }}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: 'inline-block',
                      marginLeft: '8px',
                      marginTop: '4px',
                    }} />
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  {notif.message}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
                  {formatDateTime(notif.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Settings */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Location Settings
          </h2>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Current Location</p>
            <div style={{
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <MapPin size={18} color="#3b82f6" />
              <span style={{ fontWeight: '600', color: '#111827' }}>
                {donor.location.city}, {donor.location.state}
              </span>
            </div>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Preferred Donation Radius
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[5, 10, 25].map(radius => (
                <button
                  key={radius}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '6px',
                    border: donor.preferredRadius === radius ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    backgroundColor: donor.preferredRadius === radius ? '#eff6ff' : 'white',
                    color: donor.preferredRadius === radius ? '#3b82f6' : '#6b7280',
                    fontWeight: donor.preferredRadius === radius ? '600' : 'normal',
                    cursor: 'pointer',
                  }}
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}>
              ℹ️ You'll be notified of emergency requests within your preferred radius
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
