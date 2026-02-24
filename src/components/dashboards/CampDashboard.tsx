import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Calendar, User, Phone, Droplet, Activity } from 'lucide-react';
import { mockDonors } from '../../data/donors';
import { Donor } from '../../types';

const CampDashboard: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<Donor | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [eligibilityInfo, setEligibilityInfo] = useState<{
    isEligible: boolean;
    message: string;
    daysSinceLastDonation?: number;
    nextEligibleDate?: string;
  } | null>(null);
  const [showNewDonorForm, setShowNewDonorForm] = useState(false);
  const [isNewlyRegistered, setIsNewlyRegistered] = useState(false);
  const [newDonorData, setNewDonorData] = useState({
    name: '',
    mobile: '',
    bloodGroup: 'O+' as 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-',
    age: '',
    weight: '',
    city: '',
    state: '',
  });

  const calculateEligibility = (donor: Donor) => {
    if (!donor.lastDonationDate) {
      return {
        isEligible: true,
        message: 'First time donor - Eligible to donate',
      };
    }

    const lastDonation = new Date(donor.lastDonationDate);
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    const requiredGap = 90;

    if (daysSince >= requiredGap) {
      return {
        isEligible: true,
        message: `Eligible to donate (${daysSince} days since last donation)`,
        daysSinceLastDonation: daysSince,
      };
    } else {
      const daysRemaining = requiredGap - daysSince;
      const nextEligible = new Date(lastDonation);
      nextEligible.setDate(nextEligible.getDate() + requiredGap);
      
      return {
        isEligible: false,
        message: `Not eligible - ${daysRemaining} days remaining`,
        daysSinceLastDonation: daysSince,
        nextEligibleDate: nextEligible.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };
    }
  };

  const handleSearch = () => {
    setSearchPerformed(true);
    setShowNewDonorForm(false);
    setIsNewlyRegistered(false);
    
    // Search by donor ID or mobile number
    const foundDonor = mockDonors.find(
      (donor) =>
        donor.id.toLowerCase() === searchInput.toLowerCase() ||
        donor.mobile.replace(/[\s-+]/g, '') === searchInput.replace(/[\s-+]/g, '')
    );

    if (foundDonor) {
      setSearchResult(foundDonor);
      const eligibility = calculateEligibility(foundDonor);
      setEligibilityInfo(eligibility);
    } else {
      setSearchResult(null);
      setEligibilityInfo(null);
      // Pre-fill mobile if searching by mobile number
      if (searchInput.includes('+91') || searchInput.length === 10) {
        setNewDonorData(prev => ({ ...prev, mobile: searchInput }));
      }
    }
  };

  const handleNewDonorRegistration = () => {
    // Validate required fields
    const age = parseInt(newDonorData.age);
    const weight = parseInt(newDonorData.weight);

    if (!newDonorData.name || !newDonorData.mobile || !newDonorData.age || !newDonorData.weight || !newDonorData.city || !newDonorData.state) {
      alert('Please fill in all required fields');
      return;
    }

    if (age < 18 || age > 65) {
      alert('Donor must be between 18 and 65 years old');
      return;
    }

    if (weight < 50) {
      alert('Donor must weigh at least 50 kg to donate blood');
      return;
    }

    // Create new donor record
    const newDonor: Donor = {
      id: `donor-${String(mockDonors.length + 1).padStart(3, '0')}`,
      userId: `user-donor-${String(mockDonors.length + 1).padStart(3, '0')}`,
      name: newDonorData.name,
      bloodGroup: newDonorData.bloodGroup,
      age: age,
      weight: weight,
      location: {
        city: newDonorData.city,
        state: newDonorData.state,
        latitude: 0,
        longitude: 0,
      },
      lastDonationDate: null,
      nextEligibleDate: null,
      eligibilityStatus: 'eligible',
      medicalStatus: 'pending',
      contactVerified: true,
      preferredRadius: 10,
      totalDonations: 0,
      createdAt: new Date().toISOString(),
      mobile: newDonorData.mobile,
    };

    // Add to database (mockDonors array)
    mockDonors.push(newDonor);

    // Set as search result and evaluate
    setSearchResult(newDonor);
    const eligibility = calculateEligibility(newDonor);
    setEligibilityInfo(eligibility);
    setShowNewDonorForm(false);
    setSearchPerformed(true);
    setIsNewlyRegistered(true);
  };

  const handleShowNewDonorForm = () => {
    setShowNewDonorForm(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchInput('');
    setSearchResult(null);
    setSearchPerformed(false);
    setEligibilityInfo(null);
    setShowNewDonorForm(false);
    setIsNewlyRegistered(false);
    setNewDonorData({
      name: '',
      mobile: '',
      bloodGroup: 'O+',
      age: '',
      weight: '',
      city: '',
      state: '',
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '12px',
            background: 'white',
            padding: '16px 32px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '16px',
            border: '2px solid #f3f4f6',
          }}>
            <Droplet style={{ color: '#dc2626', width: '32px', height: '32px' }} />
            <h1 style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: '700',
              color: '#111827',
            }}>
              Blood Donation Camp Portal
            </h1>
          </div>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '16px',
            margin: 0,
            fontWeight: '500',
          }}>
            Verify donor eligibility before blood donation
          </p>
        </div>

        {/* Search Card */}
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          marginBottom: '24px',
        }}>
          <label style={{ 
            display: 'block',
            fontSize: '15px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px',
          }}>
            Search by Donor ID or Mobile Number
          </label>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ 
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                width: '20px',
                height: '20px',
              }} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Donor ID (e.g., donor-001) or Mobile (+91-9876543210)"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button
              onClick={handleSearch}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              Search
            </button>

            {searchPerformed && (
              <button
                onClick={resetSearch}
                style={{
                  padding: '14px 24px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {searchPerformed && (
          <>
            {searchResult && eligibilityInfo ? (
              <>
                {/* Registration Success Banner */}
                {isNewlyRegistered && (
                  <div style={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '24px',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <CheckCircle style={{ color: 'white', width: '32px', height: '32px' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'white' }}>
                        Registration Successful!
                      </h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        Donor has been registered in the system. ID: {searchResult.id}
                      </p>
                    </div>
                  </div>
                )}

                {/* Eligibility Status Card */}
                <div style={{ 
                  background: eligibilityInfo.isEligible 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  marginBottom: '24px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    marginBottom: '16px',
                  }}>
                    {eligibilityInfo.isEligible ? (
                      <CheckCircle style={{ color: 'white', width: '48px', height: '48px' }} />
                    ) : (
                      <XCircle style={{ color: 'white', width: '48px', height: '48px' }} />
                    )}
                    <div>
                      <h2 style={{ 
                        margin: 0, 
                        fontSize: '28px', 
                        fontWeight: '700',
                        color: 'white',
                      }}>
                        {eligibilityInfo.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                      </h2>
                      <p style={{ 
                        margin: '4px 0 0 0',
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontWeight: '500',
                      }}>
                        {eligibilityInfo.message}
                      </p>
                    </div>
                  </div>

                  {!eligibilityInfo.isEligible && eligibilityInfo.nextEligibleDate && (
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <Calendar style={{ color: 'white', width: '24px', height: '24px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                          Next Eligible Date
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {eligibilityInfo.nextEligibleDate}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Status Summary */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                }}>
                  <h3 style={{ 
                    margin: '0 0 16px 0',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827',
                  }}>
                    Quick Status Check
                  </h3>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}>
                    {/* 90-Day Eligibility */}
                    <div style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: eligibilityInfo?.isEligible ? '#d1fae5' : '#fee2e2',
                      border: `2px solid ${eligibilityInfo?.isEligible ? '#10b981' : '#ef4444'}`,
                    }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>90-Day Rule</p>
                      <p style={{ 
                        margin: '4px 0 0 0', 
                        fontSize: '15px', 
                        fontWeight: '700',
                        color: eligibilityInfo?.isEligible ? '#065f46' : '#991b1b',
                      }}>
                        {eligibilityInfo?.isEligible ? '✓ Eligible' : '✗ Not Eligible'}
                      </p>
                    </div>

                    {/* Medical Status */}
                    <div style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: searchResult.medicalStatus === 'approved' ? '#d1fae5' : 
                                 searchResult.medicalStatus === 'rejected' ? '#fee2e2' : '#fef3c7',
                      border: `2px solid ${searchResult.medicalStatus === 'approved' ? '#10b981' : 
                                          searchResult.medicalStatus === 'rejected' ? '#ef4444' : '#fbbf24'}`,
                    }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Medical Status</p>
                      <p style={{ 
                        margin: '4px 0 0 0', 
                        fontSize: '15px', 
                        fontWeight: '700',
                        color: searchResult.medicalStatus === 'approved' ? '#065f46' : 
                               searchResult.medicalStatus === 'rejected' ? '#991b1b' : '#92400e',
                      }}>
                        {searchResult.medicalStatus === 'approved' ? '✓ Approved' : 
                         searchResult.medicalStatus === 'rejected' ? '✗ Rejected' : '⟳ Pending'}
                      </p>
                    </div>

                    {/* Contact Verification */}
                    <div style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: searchResult.contactVerified ? '#dbeafe' : '#fee2e2',
                      border: `2px solid ${searchResult.contactVerified ? '#3b82f6' : '#ef4444'}`,
                    }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Contact Verified</p>
                      <p style={{ 
                        margin: '4px 0 0 0', 
                        fontSize: '15px', 
                        fontWeight: '700',
                        color: searchResult.contactVerified ? '#1e40af' : '#991b1b',
                      }}>
                        {searchResult.contactVerified ? '✓ Verified' : '✗ Not Verified'}
                      </p>
                    </div>
                  </div>

                  {/* Overall Decision */}
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: eligibilityInfo?.isEligible && searchResult.medicalStatus === 'approved' ? '#ecfdf5' : '#fef2f2',
                    border: `2px solid ${eligibilityInfo?.isEligible && searchResult.medicalStatus === 'approved' ? '#10b981' : '#ef4444'}`,
                  }}>
                    <p style={{ 
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: '700',
                      color: eligibilityInfo?.isEligible && searchResult.medicalStatus === 'approved' ? '#065f46' : '#991b1b',
                    }}>
                      {eligibilityInfo?.isEligible && searchResult.medicalStatus === 'approved' 
                        ? '✓ PROCEED TO MEDICAL SCREENING - Donor meets basic eligibility criteria'
                        : '✗ CANNOT DONATE - Donor does not meet eligibility requirements'}
                    </p>
                  </div>
                </div>

                {/* Donor Details Card */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ 
                      margin: 0,
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#111827',
                    }}>
                      Donor Information
                    </h3>
                    {isNewlyRegistered && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: '#dcfce7',
                        border: '1px solid #10b981',
                      }}>
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#065f46',
                        }}>
                          NEWLY REGISTERED
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                  }}>
                    {/* Name */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                    }}>
                      <User style={{ color: '#667eea', width: '20px', height: '20px', marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Name</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                          {searchResult.name}
                        </p>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                    }}>
                      <Phone style={{ color: '#667eea', width: '20px', height: '20px', marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Mobile</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                          {searchResult.mobile}
                        </p>
                      </div>
                    </div>

                    {/* Blood Group */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                    }}>
                      <Droplet style={{ color: '#dc2626', width: '20px', height: '20px', marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Blood Group</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                          {searchResult.bloodGroup}
                        </p>
                      </div>
                    </div>

                    {/* Donor ID */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                    }}>
                      <Activity style={{ color: '#667eea', width: '20px', height: '20px', marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Donor ID</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                          {searchResult.id}
                        </p>
                      </div>
                    </div>

                    {/* Age & Weight */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                    }}>
                      <User style={{ color: '#667eea', width: '20px', height: '20px', marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Age & Weight</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                          {searchResult.age} years, {searchResult.weight} kg
                        </p>
                      </div>
                    </div>

                    {/* Total Donations */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                    }}>
                      <Droplet style={{ color: '#667eea', width: '20px', height: '20px', marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Total Donations</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                          {searchResult.totalDonations} times
                        </p>
                      </div>
                    </div>

                    {/* Last Donation */}
                    {searchResult.lastDonationDate && (
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'start',
                        gap: '12px',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '12px',
                        gridColumn: 'span 2',
                      }}>
                        <Calendar style={{ color: '#667eea', width: '20px', height: '20px', marginTop: '2px' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Last Donation Date</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                            {new Date(searchResult.lastDonationDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {eligibilityInfo.daysSinceLastDonation !== undefined && (
                              <span style={{ color: '#6b7280', fontWeight: '500', marginLeft: '8px' }}>
                                ({eligibilityInfo.daysSinceLastDonation} days ago)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      gridColumn: 'span 2',
                    }}>
                      <Activity style={{ color: '#667eea', width: '20px', height: '20px', marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Location</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                          {searchResult.location.city}, {searchResult.location.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div style={{ 
                    marginTop: '24px',
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}>
                    {/* Medical Status */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: searchResult.medicalStatus === 'approved' ? '#d1fae5' : 
                                 searchResult.medicalStatus === 'rejected' ? '#fee2e2' : '#fef3c7',
                      border: searchResult.medicalStatus === 'approved' ? '1px solid #10b981' : 
                             searchResult.medicalStatus === 'rejected' ? '1px solid #ef4444' : '1px solid #fbbf24',
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: searchResult.medicalStatus === 'approved' ? '#10b981' : 
                                   searchResult.medicalStatus === 'rejected' ? '#ef4444' : '#fbbf24',
                      }} />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: searchResult.medicalStatus === 'approved' ? '#065f46' : 
                               searchResult.medicalStatus === 'rejected' ? '#991b1b' : '#92400e',
                      }}>
                        Medical Status: {searchResult.medicalStatus.charAt(0).toUpperCase() + searchResult.medicalStatus.slice(1)}
                      </span>
                    </div>

                    {/* Contact Verified */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: searchResult.contactVerified ? '#dbeafe' : '#fee2e2',
                      border: searchResult.contactVerified ? '1px solid #3b82f6' : '1px solid #ef4444',
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: searchResult.contactVerified ? '#3b82f6' : '#ef4444',
                      }} />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: searchResult.contactVerified ? '#1e40af' : '#991b1b',
                      }}>
                        Contact: {searchResult.contactVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>

                    {/* 90-Day Status Badge */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: eligibilityInfo?.isEligible ? '#d1fae5' : '#fee2e2',
                      border: eligibilityInfo?.isEligible ? '1px solid #10b981' : '1px solid #ef4444',
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: eligibilityInfo?.isEligible ? '#10b981' : '#ef4444',
                      }} />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: eligibilityInfo?.isEligible ? '#065f46' : '#991b1b',
                      }}>
                        90-Day Rule: {eligibilityInfo?.isEligible ? 'Passed' : 'Not Passed'}
                      </span>
                    </div>
                  </div>

                  {/* Note */}
                  <div style={{ 
                    marginTop: '24px',
                    padding: '16px',
                    background: '#fef3c7',
                    borderRadius: '12px',
                    border: '2px solid #fbbf24',
                  }}>
                    <p style={{ 
                      margin: 0,
                      fontSize: '14px',
                      color: '#92400e',
                      fontWeight: '500',
                      lineHeight: '1.6',
                    }}>
                      <strong>Note:</strong> Final eligibility is subject to medical screening by camp medical staff. 
                      The 90-day eligibility is based on donation date only.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {!showNewDonorForm ? (
                  <div style={{ 
                    background: 'white',
                    borderRadius: '20px',
                    padding: '48px 32px',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  }}>
                    <XCircle style={{ 
                      color: '#ef4444',
                      width: '64px',
                      height: '64px',
                      margin: '0 auto 16px',
                    }} />
                    <h3 style={{ 
                      margin: '0 0 8px 0',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#111827',
                    }}>
                      Donor Not Found
                    </h3>
                    <p style={{ 
                      margin: '0 0 24px 0',
                      fontSize: '16px',
                      color: '#6b7280',
                    }}>
                      No donor found with the provided ID or mobile number.
                    </p>
                    <button
                      onClick={handleShowNewDonorForm}
                      style={{
                        padding: '14px 32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      Register New Donor
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    background: 'white',
                    borderRadius: '20px',
                    padding: '32px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#111827',
                    }}>
                      New Donor Registration
                    </h3>
                    <p style={{ 
                      margin: '0 0 24px 0',
                      fontSize: '14px',
                      color: '#6b7280',
                    }}>
                      Please fill in the donor's information to register them in the system
                    </p>

                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '20px',
                      marginBottom: '24px',
                    }}>
                      {/* Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={newDonorData.name}
                          onChange={(e) => setNewDonorData({ ...newDonorData, name: e.target.value })}
                          placeholder="Enter full name"
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* Mobile */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          Mobile Number *
                        </label>
                        <input
                          type="text"
                          value={newDonorData.mobile}
                          onChange={(e) => setNewDonorData({ ...newDonorData, mobile: e.target.value })}
                          placeholder="+91-9876543210"
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* Blood Group */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          Blood Group *
                        </label>
                        <select
                          value={newDonorData.bloodGroup}
                          onChange={(e) => setNewDonorData({ ...newDonorData, bloodGroup: e.target.value as any })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            outline: 'none',
                          }}
                        >
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      {/* Age */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          Age * (18-65 years)
                        </label>
                        <input
                          type="number"
                          value={newDonorData.age}
                          onChange={(e) => setNewDonorData({ ...newDonorData, age: e.target.value })}
                          placeholder="Enter age"
                          min="18"
                          max="65"
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* Weight */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          Weight (kg) * (min 50 kg)
                        </label>
                        <input
                          type="number"
                          value={newDonorData.weight}
                          onChange={(e) => setNewDonorData({ ...newDonorData, weight: e.target.value })}
                          placeholder="Enter weight in kg"
                          min="50"
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          City *
                        </label>
                        <input
                          type="text"
                          value={newDonorData.city}
                          onChange={(e) => setNewDonorData({ ...newDonorData, city: e.target.value })}
                          placeholder="Enter city"
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          State *
                        </label>
                        <select
                          value={newDonorData.state}
                          onChange={(e) => setNewDonorData({ ...newDonorData, state: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            outline: 'none',
                          }}
                        >
                          <option value="">Select State</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="West Bengal">West Bengal</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Chandigarh">Chandigarh</option>
                        </select>
                      </div>
                    </div>

                    {/* Eligibility Criteria Info */}
                    <div style={{ 
                      padding: '16px',
                      background: '#dbeafe',
                      borderRadius: '12px',
                      border: '2px solid #3b82f6',
                      marginBottom: '24px',
                    }}>
                      <p style={{ 
                        margin: 0,
                        fontSize: '13px',
                        color: '#1e40af',
                        fontWeight: '500',
                      }}>
                        <strong>Basic Eligibility Criteria:</strong> Age 18-65 years, Weight ≥ 50 kg. First-time donors are eligible for donation.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setShowNewDonorForm(false);
                          setNewDonorData({
                            name: '',
                            mobile: '',
                            bloodGroup: 'O+',
                            age: '',
                            weight: '',
                            city: '',
                            state: '',
                          });
                        }}
                        style={{
                          padding: '12px 24px',
                          background: '#f3f4f6',
                          color: '#6b7280',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleNewDonorRegistration}
                        style={{
                          padding: '12px 24px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        }}
                      >
                        Register & Evaluate
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Instructions */}
        {!searchPerformed && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
            }}>
              How to Use This Portal
            </h3>
            
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ 
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>
                  1
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                    Enter Donor ID or Mobile Number
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    Ask the donor for their registered Donor ID (e.g., donor-001) or mobile number.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ 
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>
                  2
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                    Check Eligibility Status
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    The system will verify if 90 days have passed since their last donation.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ 
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>
                  3
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                    Proceed to Medical Screening
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    If eligible, proceed with medical screening. Camp medical staff will make the final approval.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ 
              marginTop: '24px',
              padding: '16px',
              background: '#dbeafe',
              borderRadius: '12px',
              border: '2px solid #3b82f6',
            }}>
              <p style={{ 
                margin: 0,
                fontSize: '14px',
                color: '#1e40af',
                fontWeight: '500',
              }}>
                <strong>Sample IDs for Testing:</strong> donor-001 to donor-018 or mobile numbers +91-9876543210 to +91-9876543227
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampDashboard;
