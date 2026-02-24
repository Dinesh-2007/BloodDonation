import React, { useMemo, useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, CheckCircle, UserPlus, X, Phone, Mail, Camera, Bell, Droplet, Award, Trophy, Star } from 'lucide-react';
import { mockHospitals } from '../../data/hospitals';
import { indiaStates, indiaDistricts } from '../../data/indiaLocations';

interface Donor {
  id: string;
  userId: string;
  name: string;
  age: number;
  weight: number;
  bloodGroup: string;
  lastDonationDate: string;
  location: {
    city: string;
    state: string;
  };
  preferredRadius: number;
  phone: string;
  email: string;
  medicalNotes: string;
  eligibilityStatus: 'eligible' | 'not-eligible' | 'pending';
  totalDonations: number;
  nextEligibleDate: string;
  medicalStatus: string;
  donationType?: 'camp' | 'blood-bank';
  organizationName?: string;
  campLocation?: string;
  campDate?: string;
  bloodBankName?: string;
  bloodBankLocation?: string;
}

interface DonorDashboardProps {
  userId: string;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ userId }) => {
  // Load donor info from localStorage or initialize with default
  const getInitialDonor = (): Donor => {
    const stored = localStorage.getItem(`donor_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    // Default donor data
    return {
      id: userId,
      userId: userId,
      name: 'John Doe',
      age: 0,
      weight: 0,
      bloodGroup: 'O+',
      lastDonationDate: '',
      location: {
        city: indiaDistricts[indiaStates[0]]?.[0] || '',
        state: indiaStates[0] || 'Tamil Nadu',
      },
      preferredRadius: 10,
      phone: '',
      email: '',
      medicalNotes: '',
      eligibilityStatus: 'pending',
      totalDonations: 0,
      nextEligibleDate: '',
      medicalStatus: 'pending',
    };
  };

  const [donor, setDonor] = useState<Donor>(getInitialDonor);

  // UI state for full-screen register/details and profile
  const [showRegister, setShowRegister] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>(() => {
    return localStorage.getItem(`donor_${userId}_profilePic`) || '';
  });
  const defaultState = (donor.location?.state && indiaStates.includes(donor.location.state)) ? donor.location.state : indiaStates[0];
  const defaultDistrict = (donor.location?.city && (indiaDistricts[donor.location.state] || []).includes(donor.location.city)) ? donor.location.city : (indiaDistricts[defaultState] ? indiaDistricts[defaultState][0] : '');
  const [selectedState, setSelectedState] = useState<string>(defaultState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(defaultDistrict);

  const districtsForState = useMemo(() => {
    return indiaDistricts[selectedState] || [];
  }, [selectedState]);

  const hospitalsForDistrict = useMemo(() => {
    // Prefer hospitals matching district, otherwise fallback to matching state
    const byDistrict = mockHospitals.filter(h => h.location?.city === selectedDistrict && h.location?.state === selectedState);
    if (byDistrict.length) return byDistrict;
    return mockHospitals.filter(h => h.location?.state === selectedState);
  }, [selectedDistrict, selectedState]);

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
    donationType: donor.donationType || 'camp' as 'camp' | 'blood-bank',
    organizationName: donor.organizationName || '',
    campLocation: donor.campLocation || '',
    campDate: donor.campDate || '',
    bloodBankName: donor.bloodBankName || '',
    bloodBankLocation: donor.bloodBankLocation || '',
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
        donationType: donor.donationType || 'camp',
        organizationName: donor.organizationName || '',
        campLocation: donor.campLocation || '',
        campDate: donor.campDate || '',
        bloodBankName: donor.bloodBankName || '',
        bloodBankLocation: donor.bloodBankLocation || '',
      });
      setSelectedState(donor.location?.state || selectedState);
      setSelectedDistrict(donor.location?.city || selectedDistrict);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRegister, donor]);

  const handleSave = () => {
    // Calculate eligibility based on last donation date
    const lastDonation = form.lastDonationDate ? new Date(form.lastDonationDate) : null;
    const today = new Date();
    let eligibilityStatus: 'eligible' | 'not-eligible' | 'pending' = 'pending';
    let nextEligibleDate = '';
    
    if (lastDonation) {
      const daysSinceLastDonation = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
      const eligibilityDays = 90; // 3 months between donations
      
      if (daysSinceLastDonation >= eligibilityDays) {
        eligibilityStatus = 'eligible';
        nextEligibleDate = '';
      } else {
        eligibilityStatus = 'not-eligible';
        const nextDate = new Date(lastDonation);
        nextDate.setDate(nextDate.getDate() + eligibilityDays);
        nextEligibleDate = nextDate.toISOString().split('T')[0];
      }
    }

    const updatedDonor: Donor = {
      ...donor,
      name: form.name || donor.name,
      age: Number(form.age) || donor.age,
      weight: Number(form.weight) || donor.weight,
      bloodGroup: form.bloodGroup,
      lastDonationDate: form.lastDonationDate || donor.lastDonationDate,
      location: {
        city: form.district,
        state: form.state,
      },
      preferredRadius: Number(form.preferredRadius) || donor.preferredRadius,
      phone: form.phone,
      email: form.email,
      medicalNotes: form.medicalNotes,
      eligibilityStatus,
      nextEligibleDate,
      medicalStatus: form.medicalNotes ? 'under-review' : 'approved',
      totalDonations: form.lastDonationDate && form.lastDonationDate !== donor.lastDonationDate ? donor.totalDonations + 1 : donor.totalDonations,
      donationType: form.donationType,
      organizationName: form.organizationName,
      campLocation: form.campLocation,
      campDate: form.campDate,
      bloodBankName: form.bloodBankName,
      bloodBankLocation: form.bloodBankLocation,
    };

    // Save to localStorage
    localStorage.setItem(`donor_${userId}`, JSON.stringify(updatedDonor));
    setDonor(updatedDonor);
    
    setShowRegister(false);
    setShowProfileEdit(false);
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfilePicture(imageData);
        localStorage.setItem(`donor_${userId}_profilePic`, imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBadges = () => {
    const badges = [
      { name: 'First Drop', description: 'Made your first donation', requiredDonations: 1, icon: Droplet, color: '#60a5fa', bgColor: '#dbeafe' },
      { name: 'Life Saver', description: 'Saved 9 lives with 3 donations', requiredDonations: 3, icon: Heart, color: '#f472b6', bgColor: '#fce7f3' },
      { name: 'Hero', description: 'Heroic 5 donations milestone', requiredDonations: 5, icon: Star, color: '#fbbf24', bgColor: '#fef3c7' },
      { name: 'Champion', description: 'Champion donor with 10 donations', requiredDonations: 10, icon: Award, color: '#a78bfa', bgColor: '#ede9fe' },
      { name: 'Legend', description: 'Legendary status with 15 donations', requiredDonations: 15, icon: Trophy, color: '#fb923c', bgColor: '#ffedd5' },
      { name: 'Guardian Angel', description: 'Guardian of life with 20 donations', requiredDonations: 20, icon: Heart, color: '#dc2626', bgColor: '#fee2e2' },
      { name: 'Super Hero', description: 'Super hero with 25+ donations', requiredDonations: 25, icon: Star, color: '#7c3aed', bgColor: '#f3e8ff' },
    ];
    return badges;
  };

  if (showProfileEdit) {
    return (
      <div style={{ padding: '0', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
        {/* Profile Edit Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #ef4444 100%)',
          color: '#dc2626',
          padding: '24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 700, color: '#dc2626' }}>Edit Profile</h1>
          <button
            onClick={() => setShowProfileEdit(false)}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Back to Dashboard
          </button>
        </div>

        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {/* Profile Picture Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: profilePicture ? `url(${profilePicture}) center/cover` : 'linear-gradient(135deg, #ffffff 0%, #ef4444 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#dc2626',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                }}>
                  {!profilePicture && getInitials(form.name || donor.name)}
                </div>
                <label style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#dc2626',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                  <Camera size={18} color="white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Click camera icon to upload profile picture</p>
            </div>

            {/* Edit Form */}
            <form style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#dc2626'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Age *
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Age"
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#dc2626'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Blood Group *
                  </label>
                  <select
                    value={form.bloodGroup}
                    onChange={e => setForm(prev => ({ ...prev, bloodGroup: e.target.value as any }))}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                    onFocus={e => e.target.style.borderColor = '#dc2626'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#dc2626'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#dc2626'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    State *
                  </label>
                  <select
                    value={selectedState}
                    onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#dc2626'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  >
                    {indiaStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    District *
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={e => setSelectedDistrict(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#dc2626'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  >
                    {districtsForState.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowProfileEdit(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Decorative Full-screen Header */}
      <div style={{
        height: '340px',
        background: 'linear-gradient(135deg, #ffffff 0%, #ef4444 100%)',
        color: '#dc2626',
        padding: '36px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '760px', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', margin: 0, fontWeight: 700, color: '#dc2626' }}>Donor Dashboard</h1>
          <p style={{ marginTop: '8px', fontSize: '16px', color: '#991b1b', fontWeight: 500 }}>
            "A single pint can save three lives — give with a full heart."
          </p>
          <p style={{ marginTop: '18px', maxWidth: '560px', color: '#7f1d1d', margin: '18px auto 0' }}>
            Stay informed, see nearby requests, and manage your donor profile. Help is a click away — thank you for donating.
          </p>
        </div>
        <button
          title="Open registration"
          onClick={() => setShowRegister(true)}
          style={{
            background: '#dc2626',
            border: 'none',
            borderRadius: '20px',
            padding: '24px 32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(220, 38, 38, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.4)';
          }}
        >
          <UserPlus size={48} color="white" strokeWidth={2.5} />
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>Open Registration</span>
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Header summary */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>Welcome back, {donor.name}</h2>
          <p style={{ margin: '6px 0 0 0', color: '#6b7280' }}>Your donor insights and nearby activity.</p>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {/* Left Side - Contact Information (Small) */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
              Contact Info
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={24} color="#dc2626" />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}>Phone</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    {(donor as any).phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={24} color="#dc2626" />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}>Email</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827', wordBreak: 'break-word' }}>
                    {(donor as any).email || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={24} color="#dc2626" />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}>Location</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    {donor.location.city}, {donor.location.state}
                  </p>
                </div>
              </div>

              {/* Blood Group */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Heart size={24} color="#dc2626" />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}>Blood Group</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#dc2626' }}>
                    {donor.bloodGroup}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Donor Status Details */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
              Donor Status
            </h3>

            {/* Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {/* Total Donations */}
              <div style={{
                padding: '20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '2px solid #3b82f6',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Droplet size={20} color="#2563eb" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>Donations</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>
                  {donor.totalDonations} Times
                </p>
              </div>

              {/* Last Donation */}
              <div style={{
                padding: '20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '2px solid #f59e0b',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Calendar size={20} color="#d97706" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>Last Donated</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#d97706' }}>
                  {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No donations yet'}
                </p>
              </div>
            </div>

            {/* Next Eligible Date */}
            <div style={{
              padding: '20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              border: '2px solid #a855f7',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Next Eligible Date</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#9333ea' }}>
                    {donor.eligibilityStatus === 'eligible' ? 'Ready to Donate Now!' : (donor.nextEligibleDate ? new Date(donor.nextEligibleDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Check with doctor')}
                  </p>
                </div>
                <Calendar size={32} color="#9333ea" />
              </div>
            </div>

            {/* Badges Section */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={20} color="#dc2626" />
                Your Badges
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {getBadges().map((badge, index) => {
                  const isUnlocked = donor.totalDonations >= badge.requiredDonations;
                  const Icon = badge.icon;
                  return (
                    <div
                      key={index}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        backgroundColor: isUnlocked ? badge.bgColor : '#f9fafb',
                        border: `2px solid ${isUnlocked ? badge.color : '#e5e7eb'}`,
                        opacity: isUnlocked ? 1 : 0.5,
                        transition: 'all 0.3s',
                        position: 'relative',
                      }}
                    >
                      {isUnlocked && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <CheckCircle size={16} color="white" />
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: isUnlocked ? badge.color : '#d1d5db',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Icon size={20} color="white" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: isUnlocked ? badge.color : '#6b7280' }}>
                            {badge.name}
                          </p>
                          <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
                            {badge.requiredDonations} {badge.requiredDonations === 1 ? 'donation' : 'donations'}
                          </p>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: isUnlocked ? '#374151' : '#9ca3af' }}>
                        {badge.description}
                      </p>
                      {!isUnlocked && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                          🔒 {badge.requiredDonations - donor.totalDonations} more to unlock
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Notifications */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#111827' }}>
                Notifications
              </h3>
              <Bell size={18} color="#dc2626" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
              {/* Dynamic Notification - Eligibility Status */}
              {donor.eligibilityStatus === 'eligible' ? (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>
                        Now Eligible to Donate
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#15803d' }}>
                        You are now eligible to donate blood again!
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#4ade80', marginTop: '4px' }}>
                        Just now
                      </p>
                    </div>
                  </div>
                </div>
              ) : donor.eligibilityStatus === 'not-eligible' && donor.nextEligibleDate ? (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#fff7ed',
                  border: '1px solid #fed7aa',
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#9a3412', marginBottom: '4px' }}>
                        Not Yet Eligible
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#7c2d12' }}>
                        Next eligible date: {new Date(donor.nextEligibleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#fb923c', marginTop: '4px' }}>
                        Just now
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#e0f2fe',
                  border: '1px solid #bae6fd',
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#075985', marginBottom: '4px' }}>
                        Welcome!
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#0c4a6e' }}>
                        Please update your profile with donation history to check eligibility
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#38bdf8', marginTop: '4px' }}>
                        Just now
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Blood request notification - only if contact info is filled */}
              {donor.phone && donor.email && (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '4px' }}>
                        Blood Request Alert
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
                        {donor.bloodGroup} needed at nearby hospital
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#f87171', marginTop: '4px' }}>
                        Active requests
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Thank you message - only if has donations */}
              {donor.totalDonations > 0 && (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>
                        Thank You for Saving Lives!
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1e3a8a' }}>
                        You've made {donor.totalDonations} donation{donor.totalDonations > 1 ? 's' : ''}, potentially saving {donor.totalDonations * 3} lives
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#60a5fa', marginTop: '4px' }}>
                        {donor.lastDonationDate ? `Last: ${new Date(donor.lastDonationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Keep up the great work!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile update reminder - only if data is incomplete */}
              {(!donor.phone || !donor.email || !donor.lastDonationDate) && (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                        Complete Your Profile
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
                        {!donor.phone && 'Add phone number. '}
                        {!donor.email && 'Add email address. '}
                        {!donor.lastDonationDate && 'Update donation history.'}
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#fbbf24', marginTop: '4px' }}>
                        Click "Open Registration" above
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen Register / Details Modal */}
      {showRegister && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
        }}>
          <div style={{
            width: '94%',
            height: '90%',
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
                {/* Primary info form */}
                <form style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      <Heart size={16} color="#ef4444" />
                      Full Name
                    </label>
                    <input 
                      type="text"
                      value={form.name} 
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} 
                      placeholder="Enter full name"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#dc2626'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        <Calendar size={16} />
                        Age
                      </label>
                      <input 
                        type="number"
                        value={form.age} 
                        onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))} 
                        placeholder="Age"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#dc2626'}
                        onBlur={e => e.target.style.borderColor = '#d1d5db'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Weight (kg)
                      </label>
                      <input 
                        type="number"
                        value={form.weight} 
                        onChange={e => setForm(prev => ({ ...prev, weight: e.target.value }))} 
                        placeholder="Weight"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#dc2626'}
                        onBlur={e => e.target.style.borderColor = '#d1d5db'}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      <Phone size={16} />
                      Phone
                    </label>
                    <input 
                      type="tel"
                      value={form.phone} 
                      onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} 
                      placeholder="+91 XXXXX XXXXX"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#dc2626'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      <Mail size={16} />
                      Email
                    </label>
                    <input 
                      type="email"
                      value={form.email} 
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} 
                      placeholder="example@email.com"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#dc2626'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      <CheckCircle size={16} />
                      Blood Group
                    </label>
                    <select 
                      value={form.bloodGroup} 
                      onChange={e => setForm(prev => ({ ...prev, bloodGroup: e.target.value as any }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                      onFocus={e => e.target.style.borderColor = '#dc2626'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      <Calendar size={16} />
                      Date of Last Blood Donation
                    </label>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                      Leave empty if you have never donated blood before
                    </p>
                    <input 
                      type="date" 
                      value={form.lastDonationDate ? form.lastDonationDate.split('T')[0] : ''} 
                      onChange={e => setForm(prev => ({ ...prev, lastDonationDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))} 
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#dc2626'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Donation Type Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                      Donation Type
                    </label>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '2px solid ' + (form.donationType === 'camp' ? '#dc2626' : '#d1d5db'), borderRadius: '8px', cursor: 'pointer', backgroundColor: form.donationType === 'camp' ? '#fef2f2' : 'white' }}>
                        <input
                          type="radio"
                          name="donationType"
                          value="camp"
                          checked={form.donationType === 'camp'}
                          onChange={(e) => setForm(prev => ({ ...prev, donationType: e.target.value as 'camp' | 'blood-bank' }))}
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Blood Donation Camp</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>Via organization or camp</div>
                        </div>
                      </label>
                      <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '2px solid ' + (form.donationType === 'blood-bank' ? '#dc2626' : '#d1d5db'), borderRadius: '8px', cursor: 'pointer', backgroundColor: form.donationType === 'blood-bank' ? '#fef2f2' : 'white' }}>
                        <input
                          type="radio"
                          name="donationType"
                          value="blood-bank"
                          checked={form.donationType === 'blood-bank'}
                          onChange={(e) => setForm(prev => ({ ...prev, donationType: e.target.value as 'camp' | 'blood-bank' }))}
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Blood Bank</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>Direct at blood bank</div>
                        </div>
                      </label>
                    </div>

                    {/* Conditional Fields for Camp */}
                    {form.donationType === 'camp' && (
                      <div style={{ display: 'grid', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Organization Name
                          </label>
                          <input
                            type="text"
                            value={form.organizationName}
                            onChange={e => setForm(prev => ({ ...prev, organizationName: e.target.value }))}
                            placeholder="e.g., Red Cross, Rotary Club"
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Camp Location
                          </label>
                          <input
                            type="text"
                            value={form.campLocation}
                            onChange={e => setForm(prev => ({ ...prev, campLocation: e.target.value }))}
                            placeholder="e.g., Community Hall, School Auditorium"
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Camp Date
                          </label>
                          <input
                            type="date"
                            value={form.campDate ? form.campDate.split('T')[0] : ''}
                            onChange={e => setForm(prev => ({ ...prev, campDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    )}

                    {/* Conditional Fields for Blood Bank */}
                    {form.donationType === 'blood-bank' && (
                      <div style={{ display: 'grid', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Blood Bank Name
                          </label>
                          <input
                            type="text"
                            value={form.bloodBankName}
                            onChange={e => setForm(prev => ({ ...prev, bloodBankName: e.target.value }))}
                            placeholder="e.g., City Blood Bank, Government Hospital Blood Center"
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Blood Bank Location
                          </label>
                          <input
                            type="text"
                            value={form.bloodBankLocation}
                            onChange={e => setForm(prev => ({ ...prev, bloodBankLocation: e.target.value }))}
                            placeholder="e.g., City Hospital, District Health Center"
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Any Diseases / Medical Notes
                    </label>
                    <textarea 
                      value={form.medicalNotes} 
                      onChange={e => setForm(prev => ({ ...prev, medicalNotes: e.target.value }))} 
                      placeholder="Enter any medical conditions or notes..."
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', minHeight: '100px', outline: 'none', resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = '#dc2626'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </form>
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
                  <button onClick={handleSave} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white' }}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
