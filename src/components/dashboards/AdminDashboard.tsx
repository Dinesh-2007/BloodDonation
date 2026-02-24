import React, { useState } from 'react';
import { Users, AlertCircle, CheckCircle, Heart, AlertTriangle, Zap, TrendingUp, Menu, X } from 'lucide-react';
import { Card, Table, Badge } from '../common/UIComponents';
import { mockDonors } from '../../data/donors';
import { mockBloodRequests } from '../../data/bloodRequests';
import { mockAnalytics } from '../../data/analytics';
import { mockHospitals } from '../../data/hospitals';
import { mockUsers } from '../../data/users';
import { getStatusColor } from '../../utils/bloodMatchingEngine';
import { mockHospitalDetails } from '../../data/hospitalDetails';
import { mockCityEmergencies, mockZoneLoads, mockHeatZones } from '../../data/geoAnalytics';
import { mockBloodGroupInventory } from '../../data/bloodGroupInventory';

type SectionType = 'overview' | 'hospital' | 'inventory' | 'location';

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const todayRequests = mockBloodRequests.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.requestDate).toDateString() === today;
  });
  const emergencyRequests = mockBloodRequests.filter(r => r.urgency === 'emergency');
  const pendingRequests = mockBloodRequests.filter(r => r.status === 'pending');
  const activeHospitals = mockHospitalDetails.filter(h => h.hospitalStatus === 'open').length;
  const totalUsers = mockUsers.length;

  const sidebarItems = [
    { id: 'overview' as SectionType, label: '📊 System Overview', icon: '🔍' },
    { id: 'hospital' as SectionType, label: '🏥 Hospital Management', icon: '🏢' },
    { id: 'inventory' as SectionType, label: '🩸 Blood Bank Inventory', icon: '📦' },
    { id: 'location' as SectionType, label: '📍 Location Intelligence', icon: '🗺️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: sidebarOpen ? '280px' : '0',
          backgroundColor: '#1f2937',
          color: 'white',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ padding: '20px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
            ⚕️ Lab Chef
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: activeSection === item.id ? '#3b82f6' : 'transparent',
                  color: activeSection === item.id ? 'white' : '#d1d5db',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.backgroundColor = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Toggle Button */}
        <div style={{ padding: '16px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {sidebarOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px' }}>
          {/* SYSTEM OVERVIEW */}
          {activeSection === 'overview' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  📊 System Overview
                </h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>Real-time system metrics and status</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}>
                <Card
                  title="Total Hospitals Registered"
                  value={mockHospitals.length}
                  icon={<Heart size={24} />}
                  color="#3b82f6"
                />
                <Card
                  title="Active Hospitals (Live)"
                  value={activeHospitals}
                  icon={<CheckCircle size={24} />}
                  color="#10b981"
                  subtitle={`${((activeHospitals / mockHospitals.length) * 100).toFixed(0)}% operational`}
                />
                <Card
                  title="Total Users"
                  value={totalUsers}
                  icon={<Users size={24} />}
                  color="#8b5cf6"
                  subtitle="Patients + Donors"
                />
                <Card
                  title="Emergency Requests"
                  value={`${todayRequests.filter(r => r.urgency === 'emergency').length} / ${emergencyRequests.length}`}
                  icon={<AlertTriangle size={24} />}
                  color="#ef4444"
                  subtitle="Today / Total"
                />
              </div>

              {/* Additional Overview Sections */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginTop: '24px' }}>
                {/* Top Active Donors */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                    Top Active Donors
                  </h2>
                  <Table
                    headers={['ID', 'Name', 'Blood Group', 'Location', 'Status']}
                    data={mockDonors.slice(0, 5).map(donor => [
                      donor.id.substring(0, 8),
                      donor.name,
                      donor.bloodGroup,
                      donor.location.city,
                      <Badge color={getStatusColor(donor.eligibilityStatus)}>{donor.eligibilityStatus}</Badge>,
                    ])}
                  />
                </div>

                {/* Recent Requests */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                    Recent Blood Requests
                  </h2>
                  <Table
                    headers={['ID', 'Blood', 'Units', 'Urgency', 'Status']}
                    data={mockBloodRequests.slice(0, 5).map(req => [
                      req.id.substring(0, 8),
                      req.bloodGroup,
                      req.unitsRequired,
                      <Badge color={req.urgency === 'emergency' ? '#dc2626' : '#16a34a'}>
                        {req.urgency.toUpperCase()}
                      </Badge>,
                      <Badge color={getStatusColor(req.status)}>{req.status}</Badge>,
                    ])}
                  />
                </div>
              </div>

              {/* KPI Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '24px',
              }}>
                <Card
                  title="Avg Response Time"
                  value={`${mockAnalytics.emergencyResponseTime}h`}
                  icon={<Zap size={24} />}
                  color="#3b82f6"
                  subtitle="Emergency requests"
                />
                <Card
                  title="Donor Engagement"
                  value={`${mockAnalytics.donorEngagementRate}%`}
                  icon={<TrendingUp size={24} />}
                  color="#10b981"
                  subtitle="Active participation"
                />
                <Card
                  title="Pending Requests"
                  value={pendingRequests.length}
                  icon={<AlertCircle size={24} />}
                  color="#f59e0b"
                />
              </div>
            </div>
          )}

          {/* HOSPITAL MANAGEMENT */}
          {activeSection === 'hospital' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  🏥 Hospital Management & Operations
                </h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>All hospital facilities and operational details</p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <Table
                  headers={['Hospital', 'Type', 'Zone/Region', 'City', '24x7', 'Status', 'ICU', 'Ambulance']}
                  data={mockHospitalDetails.map(hospital => [
                    hospital.name,
                    <Badge color={hospital.type === 'hospital' ? '#3b82f6' : '#8b5cf6'}>{hospital.type}</Badge>,
                    `${hospital.zone} - ${hospital.region}`,
                    hospital.city,
                    <Badge color={hospital.operationalStatus24x7 ? '#10b981' : '#ef4444'}>{hospital.operationalStatus24x7 ? '✓' : '✗'}</Badge>,
                    <Badge color={hospital.hospitalStatus === 'open' ? '#10b981' : hospital.hospitalStatus === 'limited' ? '#f59e0b' : '#ef4444'}>{hospital.hospitalStatus}</Badge>,
                    <Badge color={hospital.icuAvailable ? '#10b981' : '#e5e7eb'}>{hospital.icuAvailable ? `${hospital.icuBeds} beds` : 'N/A'}</Badge>,
                    <Badge color={hospital.ambulanceAvailable ? '#10b981' : '#e5e7eb'}>{hospital.ambulanceAvailable ? `${hospital.ambulanceCount}` : 'N/A'}</Badge>,
                  ])}
                />
              </div>

              {/* Hospital Summary Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginTop: '24px',
              }}>
                <Card
                  title="Total Hospital Beds"
                  value={mockHospitalDetails.reduce((sum, h) => sum + h.icuBeds, 0)}
                  icon={<Heart size={24} />}
                  color="#3b82f6"
                  subtitle="ICU capacity"
                />
                <Card
                  title="Total Ambulances"
                  value={mockHospitalDetails.reduce((sum, h) => sum + h.ambulanceCount, 0)}
                  icon={<AlertTriangle size={24} />}
                  color="#f59e0b"
                />
                <Card
                  title="24x7 Operational"
                  value={mockHospitalDetails.filter(h => h.operationalStatus24x7).length}
                  icon={<CheckCircle size={24} />}
                  color="#10b981"
                />
              </div>
            </div>
          )}

          {/* BLOOD BANK INVENTORY */}
          {activeSection === 'inventory' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  🩸 Blood Bank & Inventory Control
                </h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>Blood group inventory across all facilities</p>
              </div>

              {/* Blood Group Summary Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}>
                {mockBloodGroupInventory.map((inventory) => (
                  <div
                    key={inventory.bloodGroup}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '16px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      borderLeft: `4px solid ${inventory.emergencyShortage ? '#dc2626' : inventory.lowStockAlert ? '#f59e0b' : '#10b981'}`,
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                        {inventory.bloodGroup}
                      </h3>
                      {inventory.emergencyShortage && <AlertTriangle size={20} style={{ color: '#dc2626' }} />}
                      {inventory.lowStockAlert && !inventory.emergencyShortage && <AlertCircle size={20} style={{ color: '#f59e0b' }} />}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#6b7280',
                    }}>
                      <span>Available: <strong style={{ color: '#111827' }}>{inventory.totalUnitsAvailable}</strong></span>
                      <span>Reserved: <strong style={{ color: '#111827' }}>{inventory.totalUnitsReserved}</strong></span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: inventory.emergencyShortage ? '#dc2626' : inventory.lowStockAlert ? '#f59e0b' : '#10b981',
                          width: `${Math.min((inventory.totalUnitsAvailable / 150) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      color: '#6b7280',
                    }}>
                      {inventory.emergencyShortage && '⚠️ Emergency Shortage'}
                      {inventory.lowStockAlert && !inventory.emergencyShortage && '⚠️ Low Stock'}
                      {!inventory.lowStockAlert && '✓ Status Normal'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Blood Inventory Details Table */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                  Blood Inventory Details by Hospital
                </h3>
                <Table
                  headers={['Blood Group', 'Hospital', 'Available', 'Reserved', 'Status', 'Alert']}
                  data={mockBloodGroupInventory.flatMap((inv) =>
                    inv.hospitals.slice(0, 2).map((hospital) => [
                      <span style={{ fontWeight: 'bold' }}>{inv.bloodGroup}</span>,
                      hospital.hospitalName.substring(0, 20),
                      hospital.unitsAvailable,
                      hospital.unitsReserved,
                      <Badge color={inv.emergencyShortage ? '#dc2626' : inv.lowStockAlert ? '#f59e0b' : '#10b981'}>
                        {inv.emergencyShortage ? 'Critical' : inv.lowStockAlert ? 'Low' : 'Normal'}
                      </Badge>,
                      inv.emergencyShortage ? '🔴 Emergency' : inv.lowStockAlert ? '🟡 Low Stock' : '🟢 OK',
                    ])
                  ).slice(0, 12)}
                />
              </div>
            </div>
          )}

          {/* LOCATION INTELLIGENCE */}
          {activeSection === 'location' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  📍 Location Intelligence & Geo-Analytics
                </h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>Geographic emergency data and demand analysis</p>
              </div>

              {/* City-Wise Emergency Count */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '24px',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                  City-Wise Emergency Count
                </h3>
                <Table
                  headers={['City', 'Zone', 'Today', 'Total', 'Demand Level']}
                  data={mockCityEmergencies.map((city) => [
                    city.city,
                    city.zone,
                    <span style={{ fontWeight: 'bold', color: city.emergencyCountToday > 0 ? '#dc2626' : '#10b981' }}>
                      {city.emergencyCountToday}
                    </span>,
                    city.emergencyCountTotal,
                    <Badge
                      color={
                        city.demand === 'critical'
                          ? '#dc2626'
                          : city.demand === 'high'
                          ? '#f59e0b'
                          : city.demand === 'medium'
                          ? '#f59e0b'
                          : '#10b981'
                      }
                    >
                      {city.demand.toUpperCase()}
                    </Badge>,
                  ])}
                />
              </div>

              {/* Zone-Wise Hospital Load & Response */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '24px',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                  Zone-Wise Hospital Load & Critical Blood Groups
                </h3>
                {mockZoneLoads.map((zone, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: '16px',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${zone.loadPercentage > 70 ? '#dc2626' : zone.loadPercentage > 50 ? '#f59e0b' : '#10b981'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>
                        {zone.zone}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        Load: <strong>{zone.loadPercentage}%</strong>
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>Hospitals:</span> <strong>{zone.hospitalCount}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Active Beds:</span> <strong>{zone.activeBeds}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Avg Response:</span> <strong>{zone.averageResponseTime}h</strong>
                      </div>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}>
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: zone.loadPercentage > 70 ? '#dc2626' : zone.loadPercentage > 50 ? '#f59e0b' : '#10b981',
                          width: `${zone.loadPercentage}%`,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      🩸 Critical Blood Types: {zone.criticalBloodGroups.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* High Demand Areas - Heat Zones */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                  High Demand Areas - Heat Zones
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}>
                  {mockHeatZones.map((zone, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        borderTop: `4px solid ${
                          zone.demandLevel === 'critical'
                            ? '#dc2626'
                            : zone.demandLevel === 'high'
                            ? '#f59e0b'
                            : zone.demandLevel === 'medium'
                            ? '#f59e0b'
                            : '#10b981'
                        }`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{zone.zone}</h4>
                        <Badge
                          color={
                            zone.demandLevel === 'critical'
                              ? '#dc2626'
                              : zone.demandLevel === 'high'
                              ? '#f59e0b'
                              : zone.demandLevel === 'medium'
                              ? '#f59e0b'
                              : '#10b981'
                          }
                        >
                          {zone.demandLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        <div>📊 Weekly Emergencies: <strong>{zone.emergencyRequestsWeekly}</strong></div>
                        <div>👥 Population: <strong>{zone.populationServed.toLocaleString()}</strong></div>
                      </div>
                      {zone.emergentBloodTypes.length > 0 && (
                        <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 'bold' }}>
                          ⚠️ Urgent: {zone.emergentBloodTypes.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
