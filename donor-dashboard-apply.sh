#!/usr/bin/env bash
# Writes updated DonorDashboard.tsx into src/components/dashboards/
# Usage:
#   chmod +x donor-dashboard-apply.sh
#   ./donor-dashboard-apply.sh
# Then commit the change with git.

TARGET="src/components/dashboards/DonorDashboard.tsx"
mkdir -p "$(dirname "$TARGET")"
cat > "$TARGET" <<'EOF'
import React, { useMemo, useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, CheckCircle, Bell, UserPlus, X, Phone, Mail } from 'lucide-react';
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

  // UI state for full-screen register/details
  const [showRegister, setShowRegister] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chennai');

  const indiaStates = useMemo(() => {
    const states = Array.from(new Set(mockHospitals.map(h => (h.location && h.location.state) || ''))).filter(Boolean) as string[];
    return states.length ? states : ['Tamil Nadu'];
  }, []);

  const districtsForState = useMemo(() => {
    return Array.from(new Set(mockHospitals.filter(h => h.location.state === selectedState).map(h => (h.location && (h.location.city || ''))))).filter(Boolean) as string[];
  }, [selectedState]);

  const hospitalsForDistrict = useMemo(() => {
    return mockHospitals.filter(h => (h.location && h.location.city) === selectedDistrict);
  }, [selectedDistrict]);

  // form state for editing donor details in modal
  const [form, setForm] = useState({
    name: '',
    age: '',
    weight: '',
    phone: '',
    email: '',
    bloodGroup: donor.bloodGroup,
    lastDonationDate: donor.lastDonationDate || '',
    medicalNotes: (donor as any).medicalNotes || '',
    country: 'India',
    state: selectedState,
    district: selectedDistrict,
    preferredRadius: donor.preferredRadius?.toString() || '10',
  });

  useEffect(() => {
    if (showRegister) {
      setForm({
        name: donor.name,
        age: donor.age?.toString() || '',
        weight: donor.weight?.toString() || '',
        phone: (donor as any).phone || '',
        email: (donor as any).email || '',
        bloodGroup: donor.bloodGroup,
        lastDonationDate: donor.lastDonationDate || '',
        medicalNotes: (donor as any).medicalNotes || '',
        country: 'India',
        state: donor.location?.state || selectedState,
        district: donor.location?.city || selectedDistrict,
        preferredRadius: donor.preferredRadius?.toString() || '10',
      });
      setSelectedState(donor.location?.state || selectedState);
      setSelectedDistrict(donor.location?.city || selectedDistrict);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRegister, donor]);

  const handleSave = () => {
    const idx = mockDonors.findIndex(d => d.id === donor.id);
    if (idx >= 0) {
      const md = mockDonors[idx] as any;
      md.name = form.name;
      md.age = Number(form.age) || md.age;
      md.weight = Number(form.weight) || md.weight;
      md.lastDonationDate = form.lastDonationDate || md.lastDonationDate;
      md.location = { ...md.location, city: form.district, state: form.state };
      md.preferredRadius = Number(form.preferredRadius) || md.preferredRadius;
      md.phone = form.phone;
      md.email = form.email;
      md.medicalNotes = form.medicalNotes;
    }
    setShowRegister(false);
  };

  return (
    <div style={{ padding: '0', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Decorative Full-screen Header */}
      <div style={{
        height: '340px',
        background: 'linear-gradient(90deg,#7c3aed, #ef4444)',
        color: 'white',
        padding: '36px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ maxWidth: '760px' }}>
          <h1 style={{ fontSize: '36px', margin: 0, fontWeight: 700 }}>Donor Dashboard</h1>
          <p style={{ marginTop: '8px', opacity: 0.95, fontSize: '16px' }}>
            "A single pint can save three lives — give with a full heart."
          </p>
          <p style={{ marginTop: '18px', maxWidth: '560px', color: 'rgba(255,255,255,0.9)' }}>
            Stay informed, see nearby requests, and manage your donor profile. Help is a click away — thank you for donating.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Registered Donor</div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>{donor.name}</div>
          </div>
          <button
            title="Open registration"
            onClick={() => setShowRegister(true)}
            style={{
              background: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UserPlus size={20} color="#7c3aed" />
          </button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Header summary */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>Welcome back, {donor.name}</h2>
          <p style={{ margin: '6px 0 0 0', color: '#6b7280' }}>Your donor insights and nearby activity.</p>
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

      {/* Full-screen Register / Details Modal */}
      {showRegister && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
        }}>
          <div style={{
            width: '94%',
            height: '94%',
            background: 'white',
            borderRadius: '12px',
            padding: '28px',
            overflow: 'auto',
            position: 'relative',
          }}>
            <button onClick={() => setShowRegister(false)} style={{
              position: 'absolute',
              right: '18px',
              top: '18px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }} aria-label="Close">
              <X size={22} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0 }}>Donor Details</h2>
              <div style={{ color: '#6b7280' }}>Full-screen view of your profile and settings</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
              <div>
                {/* Primary info */}
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Heart size={20} color="#ef4444" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Full Name</div>
                      <div style={{ fontWeight: 700 }}>
                        <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} style={{ width: '100%', fontWeight: 700, border: 'none', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Calendar size={18} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Age</div>
                      <div style={{ fontWeight: 700 }}>
                        <input value={form.age} onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))} style={{ width: '60px', fontWeight: 700, border: 'none', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: 20 }} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Weight</div>
                      <div style={{ fontWeight: 700 }}>
                        <input value={form.weight} onChange={e => setForm(prev => ({ ...prev, weight: e.target.value }))} style={{ width: '80px', fontWeight: 700, border: 'none', outline: 'none' }} /> kg
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Phone size={18} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Phone</div>
                      <div style={{ fontWeight: 700 }}>
                        <input value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} style={{ width: '160px', fontWeight: 700, border: 'none', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Mail size={18} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Email</div>
                      <div style={{ fontWeight: 700 }}>
                        <input value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} style={{ width: '200px', fontWeight: 700, border: 'none', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <CheckCircle size={18} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Blood Group</div>
                      <div style={{ fontWeight: 700 }}>{donor.bloodGroup}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Calendar size={18} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Last Donation</div>
                      <div style={{ fontWeight: 700 }}>
                        <input type="date" value={form.lastDonationDate ? form.lastDonationDate.split('T')[0] : ''} onChange={e => setForm(prev => ({ ...prev, lastDonationDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))} style={{ border: 'none', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Any Diseases / Notes</div>
                    <textarea value={form.medicalNotes} onChange={e => setForm(prev => ({ ...prev, medicalNotes: e.target.value }))} style={{ marginTop: '6px', padding: '12px', background: '#f8fafc', borderRadius: '8px', width: '100%', minHeight: '80px', border: '1px solid #eef2f7' }} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#fafafa', padding: '16px', borderRadius: '10px' }}>
                <div style={{ fontWeight: 700, marginBottom: '8px' }}>Address & Nearby Hospital</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Country</div>
                <div style={{ fontWeight: 700, marginBottom: '12px' }}>India</div>

                <div style={{ fontSize: '12px', color: '#6b7280' }}>State</div>
                <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(''); }} style={{ width: '100%', padding: '10px', borderRadius: '6px', marginTop: '6px', marginBottom: '12px' }}>
                  {indiaStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div style={{ fontSize: '12px', color: '#6b7280' }}>District</div>
                <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', marginTop: '6px', marginBottom: '12px' }}>
                  {districtsForState.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <div style={{ fontSize: '12px', color: '#6b7280' }}>Nearby Hospitals</div>
                <div style={{ marginTop: '8px', display: 'grid', gap: '8px' }}>
                  {hospitalsForDistrict.length === 0 && <div style={{ color: '#9ca3af' }}>No hospitals found for selected district.</div>}
                  {hospitalsForDistrict.map(h => (
                    <div key={h.id} style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #eef2f7' }}>
                      <div style={{ fontWeight: 700 }}>{h.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{h.location?.city}, {h.location?.state}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => setShowRegister(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white' }}>Cancel</button>
                  <button onClick={handleSave} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: 'white' }}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
EOF

printf "Wrote %s\n" "$TARGET"
printf "Run the following to commit:\n"
printf "git add -A\n"
printf "git commit -m \"Donor dashboard: full-screen header, modal details with editable fields and India state/district hospital filter\"\n"
