import React, { useState } from 'react';

import { Users, AlertCircle, Heart, AlertTriangle, Zap, TrendingUp, Menu, X } from 'lucide-react';
import { Card, Table, Badge } from '../common/UIComponents';
import { mockHospitalDetails } from '../../data/hospitalDetails';
import { mockCityEmergencies, mockZoneLoads, mockHeatZones } from '../../data/geoAnalytics';
import { mockBloodGroupInventory } from '../../data/bloodGroupInventory';
import { BloodGroup } from '../../types';

type SectionType = 'overview' | 'hospital' | 'inventory' | 'location';
type OverviewSubsection = 'hero' | 'emergency' | 'hospital' | 'blood' | 'location' | 'user' | 'time' | 'notification';

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>('overview');
  const [activeOverviewTab, setActiveOverviewTab] = useState<OverviewSubsection>('hero');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Hospital Management Selection States
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Mumbai City');
  const [selectedHospital, setSelectedHospital] = useState<string>('hospital-001');
  
  // Blood Donation Section Selection States
  const [bloodDonationState, setBloodDonationState] = useState<string>('Maharashtra');
  const [bloodDonationDistrict, setBloodDonationDistrict] = useState<string>('Mumbai City');
  
  // Get unique values for dropdowns
  const uniqueStates = Array.from(new Set(mockHospitalDetails.map(h => h.zone)));
  const districtsInState = Array.from(new Set(mockHospitalDetails.filter(h => h.zone === selectedState).map(h => h.region)));
  const hospitalsInDistrict = mockHospitalDetails.filter(h => h.zone === selectedState && h.region === selectedDistrict);
  
  // Blood Donation dropdown values
  const bloodDonationDistrictsInState = Array.from(new Set(mockHospitalDetails.filter(h => h.zone === bloodDonationState).map(h => h.region)));
  
  // Get selected hospital data
  const currentHospital = mockHospitalDetails.find(h => h.id === selectedHospital);
  
  // Calculate dynamic hospital metrics based on selected hospital
  const hospitalMetrics = currentHospital ? {
    // Emergency requests scale with hospital size (ICU beds)
    totalEmergencyRequests: Math.floor(currentHospital.icuBeds / 5) + 3,
    pendingRequests: Math.floor(currentHospital.icuBeds / 10) + 2,
    
    // Active cases based on hospital capacity
    activeCases: Math.floor(currentHospital.icuBeds * 0.6),
    criticalCases: Math.floor(currentHospital.icuBeds * 0.08),
    
    // Total beds estimation (ICU beds typically 10-15% of total)
    totalBeds: currentHospital.icuBeds * 6,
    availableBeds: Math.floor(currentHospital.icuBeds * 1.2),
    
    // ICU Beds
    totalICU: currentHospital.icuBeds,
    availableICU: Math.floor(currentHospital.icuBeds * 0.25),
    
    // Ambulance Status
    totalAmbulances: currentHospital.ambulanceCount,
    availableAmbulances: Math.floor(currentHospital.ambulanceCount * 0.5),
    dispatchedAmbulances: Math.floor(currentHospital.ambulanceCount * 0.42),
    maintenanceAmbulances: Math.max(1, Math.floor(currentHospital.ambulanceCount * 0.08)),
    
    // Ventilators (typically 30-40% of ICU beds)
    totalVentilators: Math.floor(currentHospital.icuBeds * 0.35),
    availableVentilators: Math.floor(currentHospital.icuBeds * 0.12),
  } : null;

  // Generate dynamic emergency requests based on hospital location
  const generateEmergencyRequests = () => {
    if (!currentHospital) return [];

    const locationData: Record<string, { areas: string[]; names: string[] }> = {
      'Maharashtra': {
        areas: ['Andheri West', 'Bandra East', 'Dadar', 'Thane West', 'Vile Parle', 'Powai', 'Kandivali', 'Borivali', 'Pune Camp', 'Kothrud', 'Shivaji Nagar', 'Kharadi', 'Nagpur Central', 'Sitabuldi'],
        names: ['Rajesh Kumar', 'Priya Patil', 'Amit Deshmukh', 'Sneha Kulkarni', 'Vikram Bhosale', 'Anjali Joshi', 'Rohit Pawar', 'Kavita Sharma']
      },
      'Delhi': {
        areas: ['Connaught Place', 'Rohini', 'Dwarka', 'Lajpat Nagar', 'Karol Bagh', 'Saket', 'Vasant Vihar', 'Pitampura', 'Janakpuri', 'Greater Kailash'],
        names: ['Anil Kumar', 'Neha Gupta', 'Vikram Malhotra', 'Priya Verma', 'Rajesh Sharma', 'Ananya Singh', 'Suresh Kapoor', 'Meera Chatterjee']
      },
      'Karnataka': {
        areas: ['Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'HSR Layout', 'Marathahalli', 'Yelahanka', 'Mysore Road', 'Mangaluru City', 'Hubballi Central'],
        names: ['Vivek Rao', 'Lakshmi Prasad', 'Ramesh Shetty', 'Kavita Desai', 'Suresh Kumar', 'Deepa Rao', 'Karthik Gowda', 'Priya Nayak']
      },
      'Tamil Nadu': {
        areas: ['T Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'Guindy', 'Coimbatore RS Puram', 'Gandhipuram', 'Madurai Anna Nagar', 'Trichy Cantonment', 'Salem Junction'],
        names: ['Karthik Subramaniam', 'Selvi Muthu', 'Rajendran Pillai', 'Anitha Ramesh', 'Vijay Kumar', 'Lakshmi Venkat', 'Mohan Kumar', 'Priya Iyer']
      },
      'West Bengal': {
        areas: ['Salt Lake', 'Park Street', 'Howrah Station', 'Ballygunge', 'New Town', 'Durgapur City Center', 'Siliguri Matigara', 'Asansol GT Road'],
        names: ['Sourav Banerjee', 'Monika Das', 'Swapan Mukherjee', 'Ritu Sen', 'Anirban Chatterjee', 'Debasis Roy', 'Pramod Sharma', 'Deepa Bose']
      }
    };

    const emergencyTypes = ['Road Accident', 'Surgery', 'Pregnancy Complication', 'Trauma', 'Emergency Surgery', 'Cardiac Arrest', 'Blood Loss', 'Critical Burns'];
    const bloodGroups = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    const urgencies: ('critical' | 'high' | 'medium')[] = ['critical', 'high', 'medium'];
    const statuses: ('pending' | 'accepted' | 'in-progress')[] = ['pending', 'accepted', 'in-progress'];

    const locData = locationData[currentHospital.zone] || locationData['Maharashtra'];
    const requests = [];
    const numRequests = 5;
    const hospitalHash = currentHospital.id.split('-')[1];
    const seed = parseInt(hospitalHash || '1');

    for (let i = 0; i < numRequests; i++) {
      const idx = (seed + i) % locData.areas.length;
      const nameIdx = (seed + i * 2) % locData.names.length;
      const typeIdx = (seed + i * 3) % emergencyTypes.length;
      const bgIdx = (seed + i * 4) % bloodGroups.length;
      const urgIdx = i < 2 ? 0 : (i === 2 ? 1 : 2); // First 2 critical, 3rd high, rest medium
      const statusIdx = i === 0 || i === 3 || i === 4 ? 0 : (i === 1 ? 1 : 2); // Mix of statuses

      const hours = 14 - Math.floor(i * 0.5);
      const mins = 23 - (i * 8);
      const phoneNum = `+91-${98765 + i}-${43210 + i}`;

      requests.push({
        id: `ER-${currentHospital.zone.substring(0, 3).toUpperCase()}-${hospitalHash}-${String(i + 1).padStart(3, '0')}`,
        time: `${hours}:${String(mins).padStart(2, '0')}`,
        type: emergencyTypes[typeIdx],
        patientName: locData.names[nameIdx],
        bloodGroup: bloodGroups[bgIdx],
        units: i % 2 === 0 ? 3 : (i % 3 === 0 ? 1 : 2),
        location: `${locData.areas[idx]}, ${currentHospital.city}`,
        phone: phoneNum,
        urgency: urgencies[urgIdx],
        status: statuses[statusIdx],
        hospital: statuses[statusIdx] !== 'pending' ? currentHospital.name : undefined,
        eta: statuses[statusIdx] === 'accepted' ? '30 mins' : (statuses[statusIdx] === 'in-progress' ? '15 mins' : undefined)
      });
    }

    return requests;
  };

  const emergencyRequests = generateEmergencyRequests();

  // Generate dynamic blood inventory based on hospital
  const generateBloodInventory = () => {
    if (!currentHospital) return [];

    const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    
    // Create hash from hospital ID for seeded randomization
    const hashCode = currentHospital.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Base inventory scales with hospital size (ICU beds)
    const baseUnits = Math.floor(currentHospital.icuBeds / 2); // 20-30 units base
    
    return bloodGroups.map((bloodGroup, index) => {
      // Seeded random for this blood group
      const seed = (hashCode * (index + 1)) % 100;
      
      // Different blood groups have different availability patterns
      // O+ and A+ are usually more common
      let multiplier = 1.0;
      if (bloodGroup === 'O+' || bloodGroup === 'A+') multiplier = 1.5;
      else if (bloodGroup === 'B+') multiplier = 1.2;
      else if (bloodGroup === 'AB+') multiplier = 0.7;
      else if (bloodGroup === 'O-' || bloodGroup === 'A-') multiplier = 0.8;
      else if (bloodGroup === 'B-' || bloodGroup === 'AB-') multiplier = 0.5;
      
      // Calculate units with some variation
      const variation = (seed % 15) - 7; // -7 to +7 variation
      const units = Math.max(0, Math.floor(baseUnits * multiplier + variation));
      
      // Classify status
      let status: 'critical' | 'low' | 'normal' = 'normal';
      if (units === 0) status = 'critical';
      else if (units <= 10) status = 'critical';
      else if (units <= 20) status = 'low';
      
      return {
        bloodGroup,
        units,
        status,
      };
    });
  };

  const bloodInventory = generateBloodInventory();

  // Generate state/district-level blood donation inventory for System Overview
  const generateStateLevelBloodInventory = () => {
    const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    
    // Create hash from selected state and district for seeded randomization
    const stateHash = bloodDonationState.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const districtHash = bloodDonationDistrict ? bloodDonationDistrict.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const combinedHash = stateHash + districtHash;
    
    // Base inventory depends on state population (larger states have more inventory)
    const stateMultipliers: Record<string, number> = {
      'Maharashtra': 1.5,
      'Delhi': 1.2,
      'Karnataka': 1.3,
      'Tamil Nadu': 1.4,
      'West Bengal': 1.1,
    };
    const stateMultiplier = stateMultipliers[bloodDonationState] || 1.0;
    
    return bloodGroups.map((bloodGroup, index) => {
      // Seeded random for this blood group
      const seed = (combinedHash * (index + 1)) % 100;
      
      // Base units for state-level inventory (larger than individual hospitals)
      let baseUnits = 100;
      
      // Blood group distribution (O+ and A+ more common)
      let multiplier = 1.0;
      if (bloodGroup === 'O+') multiplier = 1.5;
      else if (bloodGroup === 'A+') multiplier = 1.2;
      else if (bloodGroup === 'B+') multiplier = 1.0;
      else if (bloodGroup === 'AB+') multiplier = 0.7;
      else if (bloodGroup === 'O-') multiplier = 0.6;
      else if (bloodGroup === 'A-') multiplier = 0.45;
      else if (bloodGroup === 'B-') multiplier = 0.35;
      else if (bloodGroup === 'AB-') multiplier = 0.28;
      
      // Calculate units with state variation
      const variation = (seed % 30) - 15; // -15 to +15 variation
      const totalUnitsAvailable = Math.max(0, Math.floor(baseUnits * multiplier * stateMultiplier + variation));
      const totalUnitsReserved = Math.floor(totalUnitsAvailable * 0.2); // 20% reserved
      
      // Classify status based on availability
      let emergencyShortage = false;
      let lowStockAlert = false;
      let criticalLevel = false;
      
      if (totalUnitsAvailable <= 30) {
        emergencyShortage = true;
        criticalLevel = true;
      } else if (totalUnitsAvailable <= 60) {
        lowStockAlert = true;
        criticalLevel = false;
      }
      
      return {
        bloodGroup,
        totalUnitsAvailable,
        totalUnitsReserved,
        criticalLevel,
        lowStockAlert,
        emergencyShortage,
        hospitals: [], // Not needed for state-level overview
      };
    });
  };

  const stateLevelBloodInventory = generateStateLevelBloodInventory();

  const sidebarItems = [
    { id: 'overview' as SectionType, label: '📊 System Overview', icon: '🔍' },
    { id: 'hospital' as SectionType, label: '🏥 Hospital Management', icon: '🏢' },
    { id: 'inventory' as SectionType, label: '🩸 Blood Bank Inventory', icon: '📦' },
    { id: 'location' as SectionType, label: '📍 Location Intelligence', icon: '🗺️' },
  ];

  type BarItem = { label: string; value: number; color: string; suffix?: string };
  type PieSlice = { label: string; value: number; color: string };

  const formatCompactNumber = (value: number) => {
    if (Number.isNaN(value)) return '0';
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return `${value}`;
  };

  const MiniBarChart = ({ title, items }: { title: string; items: BarItem[] }) => {
    const max = Math.max(1, ...items.map((i) => i.value));
    return (
      <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item) => {
            const widthPct = Math.max(4, Math.round((item.value / max) * 100));
            return (
              <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 72px', gap: '10px', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
                <div style={{ height: '10px', backgroundColor: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${widthPct}%`, height: '100%', backgroundColor: item.color }} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', textAlign: 'right' }}>
                  {formatCompactNumber(item.value)}{item.suffix ?? ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const MiniPieChart = ({ title, slices }: { title: string; slices: PieSlice[] }) => {
    const total = Math.max(1, slices.reduce((sum, s) => sum + s.value, 0));

    let running = 0;
    const gradientStops = slices
      .filter((s) => s.value > 0)
      .map((s) => {
        const start = (running / total) * 100;
        running += s.value;
        const end = (running / total) * 100;
        return `${s.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      })
      .join(', ');

    return (
      <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{title}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '999px',
              background: gradientStops ? `conic-gradient(${gradientStops})` : '#e5e7eb',
              position: 'relative',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '26px',
                borderRadius: '999px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {slices.map((s) => {
              const pct = Math.round((s.value / total) * 100);
              return (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: s.color }} />
                    <div style={{ fontSize: '12px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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
                <p style={{ color: '#6b7280', marginTop: '4px' }}>Impact Metrics & Usage & Benefit Statistics</p>
              </div>

              {/* OVERVIEW TABS */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                overflowX: 'auto',
                paddingBottom: '8px',
                borderBottom: '2px solid #e5e7eb',
              }}>
                {[
                  { id: 'hero', label: '🏆 Hero Numbers' },
                  { id: 'emergency', label: '🩺 Emergency Impact' },
                  { id: 'hospital', label: '🏥 Hospital Benefits' },
                  { id: 'blood', label: '🩸 Blood Donation' },
                  { id: 'location', label: '🌍 Location Efficiency' },
                  { id: 'user', label: '👥 User Benefits' },
                  { id: 'time', label: '⏱️ Time & Cost' },
                  { id: 'notification', label: '🔔 Alert Effectiveness' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOverviewTab(tab.id as OverviewSubsection)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: activeOverviewTab === tab.id ? '#3b82f6' : 'transparent',
                      color: activeOverviewTab === tab.id ? 'white' : '#6b7280',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      if (activeOverviewTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeOverviewTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 🏆 HERO NUMBERS - Overall Impact Summary */}
              {activeOverviewTab === 'hero' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginBottom: '32px',
                borderTop: '4px solid #f59e0b',
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
                  🏆 Overall Impact Summary (Hero Numbers)
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                }}>
                  <Card title="Total Emergencies Assisted" value="4,847" icon={<AlertTriangle size={24} />} color="#ef4444" subtitle="Lives saved" />
                  <Card title="Total Blood Units Delivered" value="12,365" icon={<Heart size={24} />} color="#dc2626" subtitle="Units distributed" />
                  <Card title="Total Lives Impacted" value="18,592" icon={<Users size={24} />} color="#8b5cf6" subtitle="Patients + Donors" />
                  <Card title="Avg Response Time Reduction" value="62%" icon={<Zap size={24} />} color="#3b82f6" subtitle="vs traditional methods" />
                  <Card title="System Efficiency Gain" value="78%" icon={<TrendingUp size={24} />} color="#10b981" subtitle="Overall improvement" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <MiniBarChart
                    title="Key Improvements (%)"
                    items={[
                      { label: 'Avg Response Time Reduction', value: 62, color: '#3b82f6', suffix: '%' },
                      { label: 'System Efficiency Gain', value: 78, color: '#10b981', suffix: '%' },
                    ]}
                  />
                  <MiniPieChart
                    title="Impact Share (Totals)"
                    slices={[
                      { label: 'Emergencies Assisted', value: 4847, color: '#ef4444' },
                      { label: 'Blood Units Delivered', value: 12365, color: '#dc2626' },
                      { label: 'Lives Impacted', value: 18592, color: '#8b5cf6' },
                    ]}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Table
                    headers={['Metric', 'Value', 'Type']}
                    data={[
                      ['Total Emergencies Assisted', '4,847', 'Count'],
                      ['Total Blood Units Delivered', '12,365', 'Count'],
                      ['Total Lives Impacted', '18,592', 'Count'],
                      ['Avg Response Time Reduction', '62%', 'Percentage'],
                      ['System Efficiency Gain', '78%', 'Percentage'],
                    ]}
                  />
                </div>
              </div>
              )}

              {/* 🩺 EMERGENCY IMPACT STATS */}
              {activeOverviewTab === 'emergency' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderLeft: '4px solid #ef4444',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                  🩺 1️⃣ Emergency Impact Stats
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}>
                  <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Emergencies Handled Successfully</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>4,847</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Avg Time Saved per Emergency</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>⏱️ 45</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>minutes</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Fastest Emergency Response</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>8</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>minutes</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Emergency Resolution Rate</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>96%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Lives Assisted (Estimated)</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>❤️ 4,847</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginTop: '18px' }}>
                  <MiniBarChart
                    title="High Beneficial Cities "
                    items={mockCityEmergencies
                      .slice()
                      .sort((a, b) => b.emergencyCountTotal - a.emergencyCountTotal)
                      .slice(0, 8)
                      .map((c) => ({ label: c.city, value: c.emergencyCountTotal, color: '#ef4444' }))}
                  />
                  <MiniPieChart
                    title="Demand Level Distribution"
                    slices={(() => {
                      const counts = mockCityEmergencies.reduce(
                        (acc, c) => {
                          acc[c.demand] = (acc[c.demand] ?? 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>
                      );
                      return [
                        { label: 'Critical', value: counts.critical ?? 0, color: '#dc2626' },
                        { label: 'High', value: counts.high ?? 0, color: '#f59e0b' },
                        { label: 'Medium', value: counts.medium ?? 0, color: '#f59e0b' },
                        { label: 'Low', value: counts.low ?? 0, color: '#10b981' },
                      ];
                    })()}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Table
                    headers={['City', 'Zone', 'Blood Group', 'Units Needed', 'Hospital Name', 'Demand']}
                    data={mockCityEmergencies.map((c) => [
                      c.city,
                      c.zone,
                      c.criticalBloodGroup,
                      c.unitsNeeded,
                      c.hospitalName,
                      <Badge
                        color={
                          c.demand === 'critical'
                            ? '#dc2626'
                            : c.demand === 'high'
                            ? '#f59e0b'
                            : c.demand === 'medium'
                            ? '#f59e0b'
                            : '#10b981'
                        }
                      >
                        {c.demand.toUpperCase()}
                      </Badge>,
                    ])}
                  />
                </div>
              </div>
              )}

              {/* 🏥 HOSPITAL UTILIZATION BENEFITS */}
              {activeOverviewTab === 'hospital' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderLeft: '4px solid #3b82f6',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                  🏥 2️⃣ Hospital Utilization Benefits
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}>
                  <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Hospital Load Balanced</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>73%</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>across network</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ICU Utilization Improvement</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>41%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Bed Availability Optimization</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>58%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Overcrowding Prevented</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>342</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>cases</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Emergency Diversions Reduced</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>67%</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginTop: '18px' }}>
                  <MiniBarChart
                    title="ICU Beds (Top Hospitals)"
                    items={mockHospitalDetails
                      .slice()
                      .sort((a, b) => (b.icuBeds ?? 0) - (a.icuBeds ?? 0))
                      .slice(0, 8)
                      .map((h) => ({ label: h.name, value: h.icuBeds ?? 0, color: '#3b82f6' }))}
                  />
                  <MiniPieChart
                    title="Operational Status"
                    slices={(() => {
                      const counts = mockHospitalDetails.reduce(
                        (acc, h) => {
                          const key = h.hospitalStatus ?? 'unknown';
                          acc[key] = (acc[key] ?? 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>
                      );
                      return [
                        { label: 'Open', value: counts.open ?? 0, color: '#10b981' },
                        { label: 'Limited', value: counts.limited ?? 0, color: '#f59e0b' },
                        { label: 'Closed', value: counts.closed ?? 0, color: '#ef4444' },
                      ];
                    })()}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Table
                    headers={['Hospital', 'City', 'Status', 'ICU Beds', 'Ambulance']}
                    data={mockHospitalDetails.slice(0, 10).map((h) => [
                      h.name,
                      h.city,
                      <Badge
                        color={
                          h.hospitalStatus === 'open'
                            ? '#10b981'
                            : h.hospitalStatus === 'limited'
                            ? '#f59e0b'
                            : '#ef4444'
                        }
                      >
                        {(h.hospitalStatus ?? 'unknown').toUpperCase()}
                      </Badge>,
                      h.icuBeds,
                      h.ambulanceAvailable ? h.ambulanceCount : 'N/A',
                    ])}
                  />
                </div>
              </div>
              )}

              {/* 🩸 BLOOD DONATION IMPACT STATS */}
              {activeOverviewTab === 'blood' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderLeft: '4px solid #dc2626',
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                    🩸 3️⃣ Blood Donation Impact Stats
                  </h3>
                  
                  {/* State and District Dropdowns */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {/* State Dropdown */}
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                        State
                      </label>
                      <select
                        value={bloodDonationState}
                        onChange={(e) => {
                          setBloodDonationState(e.target.value);
                          // Reset district when state changes
                          const newDistricts = Array.from(new Set(mockHospitalDetails.filter(h => h.zone === e.target.value).map(h => h.region)));
                          if (newDistricts.length > 0) {
                            setBloodDonationDistrict(newDistricts[0]);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '14px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {uniqueStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    {/* District Dropdown */}
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                        District
                      </label>
                      <select
                        value={bloodDonationDistrict}
                        onChange={(e) => setBloodDonationDistrict(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '14px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {bloodDonationDistrictsInState.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}>
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Blood Requests Fulfilled</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>8,924</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Emergency Blood Matches</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>2,341</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Avg Time to Find Donor</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>⏱️ 12</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>minutes</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Blood Units Saved from Expiry</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>1,204</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>units</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Critical Shortage Prevented</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>28</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>incidents</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginTop: '18px' }}>
                  <MiniBarChart
                    title="Units Available by Blood Group"
                    items={stateLevelBloodInventory
                      .slice()
                      .sort((a, b) => b.totalUnitsAvailable - a.totalUnitsAvailable)
                      .map((inv) => ({
                        label: inv.bloodGroup,
                        value: inv.totalUnitsAvailable,
                        color: inv.emergencyShortage ? '#dc2626' : inv.lowStockAlert ? '#f59e0b' : '#10b981',
                      }))}
                  />
                  <MiniPieChart
                    title="Inventory Health"
                    slices={(() => {
                      const critical = stateLevelBloodInventory.filter((i) => i.emergencyShortage).length;
                      const low = stateLevelBloodInventory.filter((i) => i.lowStockAlert && !i.emergencyShortage).length;
                      const normal = Math.max(0, stateLevelBloodInventory.length - critical - low);
                      return [
                        { label: 'Critical', value: critical, color: '#dc2626' },
                        { label: 'Low', value: low, color: '#f59e0b' },
                        { label: 'Normal', value: normal, color: '#10b981' },
                      ];
                    })()}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Table
                    headers={['Blood Group', 'Available', 'Reserved', 'Status']}
                    data={stateLevelBloodInventory.map((inv) => [
                      inv.bloodGroup,
                      inv.totalUnitsAvailable,
                      inv.totalUnitsReserved,
                      <Badge color={inv.emergencyShortage ? '#dc2626' : inv.lowStockAlert ? '#f59e0b' : '#10b981'}>
                        {inv.emergencyShortage ? 'CRITICAL' : inv.lowStockAlert ? 'LOW' : 'NORMAL'}
                      </Badge>,
                    ])}
                  />
                </div>
              </div>
              )}

              {/* 🌍 LOCATION-BASED EFFICIENCY GAINS */}
              {activeOverviewTab === 'location' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderLeft: '4px solid #10b981',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                  🌍 4️⃣ Location-Based Efficiency Gains
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}>
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Nearest Hospital Match Accuracy</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>94%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Distance Reduced for Emergency</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>🌍 7.3</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>km avg</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Location-Based Matches Made</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>6,287</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Under-Served Areas Identified</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>14</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>areas</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Regional Coverage Improvement</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>53%</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginTop: '18px' }}>
                  <MiniBarChart
                    title="Hospital Load by Zone (%)"
                    items={mockZoneLoads
                      .slice()
                      .sort((a, b) => b.loadPercentage - a.loadPercentage)
                      .map((z) => ({
                        label: z.zone,
                        value: z.loadPercentage,
                        color: z.loadPercentage > 70 ? '#dc2626' : z.loadPercentage > 50 ? '#f59e0b' : '#10b981',
                        suffix: '%',
                      }))}
                  />
                  <MiniPieChart
                    title="Heat Zone Demand Mix"
                    slices={(() => {
                      const counts = mockHeatZones.reduce(
                        (acc, z) => {
                          acc[z.demandLevel] = (acc[z.demandLevel] ?? 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>
                      );
                      return [
                        { label: 'Critical', value: counts.critical ?? 0, color: '#dc2626' },
                        { label: 'High', value: counts.high ?? 0, color: '#f59e0b' },
                        { label: 'Medium', value: counts.medium ?? 0, color: '#f59e0b' },
                        { label: 'Low', value: counts.low ?? 0, color: '#10b981' },
                      ];
                    })()}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Table
                    headers={['Zone', 'Load %', 'Hospitals', 'Avg Response']}
                    data={mockZoneLoads.map((z) => [
                      z.zone,
                      z.loadPercentage,
                      z.hospitalCount,
                      `${z.averageResponseTime}h`,
                    ])}
                  />
                </div>
              </div>
              )}

              {/* 👥 USER & COMMUNITY BENEFITS */}
              {activeOverviewTab === 'user' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderLeft: '4px solid #8b5cf6',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                  👥 5️⃣ User & Community Benefits
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}>
                  <div style={{ padding: '16px', backgroundColor: '#faf5ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Active Users Benefited</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>18,592</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#faf5ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Repeat Users</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>71%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#faf5ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Donor Participation Rate</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>64%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#faf5ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Emergency Acceptance Rate</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>87%</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>from donors</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#faf5ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Community Coverage Density</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>92%</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginTop: '18px' }}>
                  <MiniBarChart
                    title="Engagement & Coverage (%)"
                    items={[
                      { label: 'Repeat Users', value: 71, color: '#8b5cf6', suffix: '%' },
                      { label: 'Donor Participation', value: 64, color: '#8b5cf6', suffix: '%' },
                      { label: 'Emergency Acceptance', value: 87, color: '#8b5cf6', suffix: '%' },
                      { label: 'Coverage Density', value: 92, color: '#8b5cf6', suffix: '%' },
                    ]}
                  />
                  <MiniPieChart
                    title="Repeat vs New Users"
                    slices={[
                      { label: 'Repeat Users', value: 71, color: '#8b5cf6' },
                      { label: 'New Users', value: 29, color: '#e5e7eb' },
                    ]}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Table
                    headers={['Metric', 'Value', 'Type']}
                    data={[
                      ['Active Users Benefited', '18,592', 'Count'],
                      ['Repeat Users', '71%', 'Percentage'],
                      ['Donor Participation Rate', '64%', 'Percentage'],
                      ['Emergency Acceptance Rate (Donors)', '87%', 'Percentage'],
                      ['Community Coverage Density', '92%', 'Percentage'],
                    ]}
                  />
                </div>
              </div>
              )}

              {/* ⏱️ TIME & COST SAVINGS */}
              {activeOverviewTab === 'time' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderLeft: '4px solid #f59e0b',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                  ⏱️ 6️⃣ Time & Cost Savings
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}>
                  <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Patient Waiting Time Reduced</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>48%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Manual Coordination Reduced</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>72%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Ambulance Routing Time Saved</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>⏱️ 18</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>min/trip</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Admin Workload Reduction</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>61%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Cost Efficiency Improvement</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>55%</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginTop: '18px' }}>
                  <MiniBarChart
                    title="Savings Overview"
                    items={[
                      { label: 'Waiting Time Reduced', value: 48, color: '#f59e0b', suffix: '%' },
                      { label: 'Manual Coordination Reduced', value: 72, color: '#f59e0b', suffix: '%' },
                      { label: 'Admin Workload Reduction', value: 61, color: '#f59e0b', suffix: '%' },
                      { label: 'Cost Efficiency Improvement', value: 55, color: '#f59e0b', suffix: '%' },
                    ]}
                  />
                  <MiniPieChart
                    title="Manual Coordination Reduction"
                    slices={[
                      { label: 'Reduced', value: 72, color: '#f59e0b' },
                      { label: 'Remaining', value: 28, color: '#e5e7eb' },
                    ]}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Table
                    headers={['Metric', 'Value', 'Unit']}
                    data={[
                      ['Avg Patient Waiting Time Reduced', '48', '%'],
                      ['Manual Coordination Reduced', '72', '%'],
                      ['Ambulance Routing Time Saved', '18', 'min/trip'],
                      ['Admin Workload Reduction', '61', '%'],
                      ['Cost Efficiency Improvement', '55', '%'],
                    ]}
                  />
                </div>
              </div>
              )}

              {/* 🔔 NOTIFICATION & ALERT EFFECTIVENESS */}
              {activeOverviewTab === 'notification' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderLeft: '4px solid #06b6d4',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                  🔔 7️⃣ Notification & Alert Effectiveness
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}>
                  <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Emergency Alerts Sent</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>4,921</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Alert Acknowledgement Rate</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>91%</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Response Trigger Time</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>⏱️ 3.2</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>seconds</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Failed Alerts</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>23</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Escalations Prevented</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>1,847</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginTop: '18px' }}>
                  <MiniBarChart
                    title="Alerts & Outcomes"
                    items={[
                      { label: 'Emergency Alerts Sent', value: 4921, color: '#06b6d4' },
                      { label: 'Failed Alerts', value: 23, color: '#ef4444' },
                      { label: 'Escalations Prevented', value: 1847, color: '#10b981' },
                    ]}
                  />
                  <MiniPieChart
                    title="Acknowledgement Rate"
                    slices={[
                      { label: 'Acknowledged', value: 91, color: '#06b6d4' },
                      { label: 'Not Acknowledged', value: 9, color: '#e5e7eb' },
                    ]}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Table
                    headers={['Metric', 'Value', 'Unit']}
                    data={[
                      ['Emergency Alerts Sent', '4,921', 'Count'],
                      ['Alert Acknowledgement Rate', '91', '%'],
                      ['Response Trigger Time', '3.2', 'seconds'],
                      ['Failed Alerts', '23', 'Count'],
                      ['Escalations Prevented', '1,847', 'Count'],
                    ]}
                  />
                </div>
              </div>
              )}
            </div>
          )}

          {/* HOSPITAL MANAGEMENT */}
          {activeSection === 'hospital' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  🏥 Hospital Management & Operations
                </h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>Real-time hospital operations and emergency management</p>
              </div>

              {/* LOCATION SELECTION */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '24px',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                  📍 Select Hospital Location
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}>
                  {/* State Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>
                      State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        const newDistricts = Array.from(new Set(mockHospitalDetails.filter(h => h.zone === e.target.value).map(h => h.region)));
                        setSelectedDistrict(newDistricts[0] || '');
                        const newHospitals = mockHospitalDetails.filter(h => h.zone === e.target.value && h.region === newDistricts[0]);
                        setSelectedHospital(newHospitals[0]?.id || '');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      {uniqueStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  {/* District Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>
                      District
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value);
                        const newHospitals = mockHospitalDetails.filter(h => h.zone === selectedState && h.region === e.target.value);
                        setSelectedHospital(newHospitals[0]?.id || '');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      {districtsInState.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hospital Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>
                      Hospital
                    </label>
                    <select
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {hospitalsInDistrict.map(hospital => (
                        <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Hospital Info */}
                {currentHospital && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                        {currentHospital.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {currentHospital.type === 'hospital' ? '🏥 Hospital' : '🩸 Blood Bank'} • {currentHospital.phone} • {currentHospital.email}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Badge color={currentHospital.operationalStatus24x7 ? '#10b981' : '#6b7280'}>
                        {currentHospital.operationalStatus24x7 ? '24×7' : 'Limited Hours'}
                      </Badge>
                      <Badge color={currentHospital.hospitalStatus === 'open' ? '#10b981' : currentHospital.hospitalStatus === 'limited' ? '#f59e0b' : '#ef4444'}>
                        {currentHospital.hospitalStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* TODAY'S SNAPSHOT */}
              {currentHospital && hospitalMetrics && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #dc2626',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <AlertTriangle size={24} style={{ color: '#dc2626' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>EMERGENCY REQUESTS</div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{hospitalMetrics.totalEmergencyRequests}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Today · {hospitalMetrics.pendingRequests} Pending</div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #f59e0b',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Zap size={24} style={{ color: '#f59e0b' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>ACTIVE CASES</div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{hospitalMetrics.activeCases}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>In-Progress · {hospitalMetrics.criticalCases} Critical</div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #3b82f6',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Heart size={24} style={{ color: '#3b82f6' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>AVAILABLE BEDS</div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{hospitalMetrics.availableBeds}<span style={{ fontSize: '18px', color: '#6b7280' }}>/{hospitalMetrics.totalBeds}</span></div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{Math.round((hospitalMetrics.availableBeds / hospitalMetrics.totalBeds) * 100)}% Available</div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #8b5cf6',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <AlertCircle size={24} style={{ color: '#8b5cf6' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>ICU BEDS</div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{hospitalMetrics.availableICU}<span style={{ fontSize: '18px', color: '#6b7280' }}>/{hospitalMetrics.totalICU}</span></div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{Math.round((hospitalMetrics.availableICU / hospitalMetrics.totalICU) * 100)}% Available</div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #10b981',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <TrendingUp size={24} style={{ color: '#10b981' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>AMBULANCE STATUS</div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{hospitalMetrics.availableAmbulances}<span style={{ fontSize: '18px', color: '#6b7280' }}>/{hospitalMetrics.totalAmbulances}</span></div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Available · {hospitalMetrics.dispatchedAmbulances} Dispatched</div>
                </div>
              </div>
              )}

              {/* EMERGENCY REQUESTS PANEL */}
              {currentHospital && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '24px',
                borderLeft: '4px solid #dc2626',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} style={{ color: '#dc2626' }} />
                  Emergency Requests (Live)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {emergencyRequests.map((request) => {
                    const urgencyColors = {
                      critical: { bg: '#fef2f2', border: '#fee2e2', badge: '#dc2626' },
                      high: { bg: '#fffbeb', border: '#fef3c7', badge: '#f59e0b' },
                      medium: { bg: '#f9fafb', border: '#e5e7eb', badge: '#6b7280' },
                    };
                    
                    const statusColors = {
                      pending: '#6b7280',
                      accepted: '#10b981',
                      'in-progress': '#3b82f6',
                    };

                    const colors = urgencyColors[request.urgency];
                    
                    return (
                      <div key={request.id} style={{
                        padding: '16px',
                        backgroundColor: colors.bg,
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{request.id}</span>
                              <Badge color={colors.badge}>{request.urgency.toUpperCase()}</Badge>
                              <Badge color={statusColors[request.status]}>{request.status.toUpperCase()}</Badge>
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>{request.time}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
                              <strong>{request.type}</strong> · {request.patientName} · <strong>{request.bloodGroup}</strong> ({request.units} units)
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              📍 {request.location} · ☎ {request.phone}
                            </div>
                            {(request.status === 'accepted' || request.status === 'in-progress') && request.hospital && (
                              <div style={{ 
                                fontSize: '12px', 
                                color: request.status === 'accepted' ? '#10b981' : '#3b82f6', 
                                marginTop: '6px', 
                                fontWeight: 600 
                              }}>
                                🏥 {request.hospital} · ETA: {request.eta}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {request.status === 'pending' ? (
                              <>
                                <button style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}>
                                  Accept
                                </button>
                                <button style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}>
                                  Decline
                                </button>
                              </>
                            ) : (
                              <button style={{
                                padding: '8px 16px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}>
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}

              {/* RESOURCE STATUS & BLOOD BANK STATUS - Split Grid */}
              {currentHospital && hospitalMetrics && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px',
                marginBottom: '24px',
              }}>
                {/* RESOURCE STATUS */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #3b82f6',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={20} style={{ color: '#3b82f6' }} />
                    Resource Status (Quick Update)
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Total Beds | Available Beds */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Total Beds</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{hospitalMetrics.totalBeds}</div>
                      </div>
                      <div style={{ borderLeft: '2px solid #e5e7eb', marginLeft: '12px', marginRight: '12px' }} />
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Available Beds</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{hospitalMetrics.availableBeds}</div>
                      </div>
                    </div>

                    {/* ICU Beds Available */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>ICU Beds Available</span>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{hospitalMetrics.availableICU}</span>
                    </div>

                    {/* Ventilator Available */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Ventilator Available</span>
                      <Badge color={hospitalMetrics.availableVentilators > 0 ? "#10b981" : "#ef4444"}>
                        {hospitalMetrics.availableVentilators > 0 ? `YES (${hospitalMetrics.availableVentilators} units)` : 'NO'}
                      </Badge>
                    </div>

                    {/* Oxygen Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Oxygen Status</span>
                      <Badge color={hospitalMetrics.availableBeds > 20 ? "#10b981" : "#f59e0b"}>
                        {hospitalMetrics.availableBeds > 20 ? 'NORMAL' : 'LOW'}
                      </Badge>
                    </div>

                    <button style={{
                      marginTop: '8px',
                      padding: '10px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}>
                      ⚡ Quick Update Resources
                    </button>
                  </div>
                </div>

                {/* BLOOD BANK STATUS */}
                {currentHospital.type === 'hospital' && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #dc2626',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={20} style={{ color: '#dc2626' }} />
                    Blood Bank Status
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '2px solid #10b981' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Blood Bank Available</span>
                      <Badge color="#10b981">YES</Badge>
                    </div>
                  </div>

                  {/* Blood Group Inventory Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '10px',
                    marginBottom: '16px'
                  }}>
                    {bloodInventory.map((item) => {
                      const statusColors = {
                        critical: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
                        low: { bg: '#fffbeb', border: '#fed7aa', text: '#f59e0b' },
                        normal: { bg: '#f0fdf4', border: '#bbf7d0', text: '#10b981' },
                      };
                      const colors = statusColors[item.status];
                      
                      return (
                        <div key={item.bloodGroup} style={{
                          padding: '12px',
                          backgroundColor: colors.bg,
                          borderRadius: '8px',
                          border: `2px solid ${colors.border}`,
                          textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                            {item.bloodGroup}
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.text }}>
                            {item.units}
                          </div>
                          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                            {item.status === 'critical' && item.units === 0 ? 'OUT OF STOCK' : 'units'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Critical Blood Groups Alert */}
                  {bloodInventory.filter(item => item.status === 'critical').length > 0 && (
                  <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>
                      ⚠️ Critical Blood Groups ({bloodInventory.filter(item => item.status === 'critical').length} groups need immediate attention)
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {bloodInventory
                        .filter(item => item.status === 'critical')
                        .map(item => (
                          <Badge key={item.bloodGroup} color="#dc2626">
                            {item.bloodGroup} ({item.units === 0 ? 'NEEDED' : `${item.units} units`})
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                  )}

                  {/* Low Stock Alert */}
                  {bloodInventory.filter(item => item.status === 'low').length > 0 && (
                  <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>
                      ⚡ Low Stock Alert ({bloodInventory.filter(item => item.status === 'low').length} groups running low)
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {bloodInventory
                        .filter(item => item.status === 'low')
                        .map(item => (
                          <Badge key={item.bloodGroup} color="#f59e0b">
                            {item.bloodGroup} ({item.units} units)
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                  )}
                </div>
                )}

                {/* No Blood Bank Message for Blood Bank Type */}
                {currentHospital.type === 'blood-bank' && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #6b7280',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={20} style={{ color: '#6b7280' }} />
                    Blood Bank Status
                  </h3>

                  <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>This facility is a dedicated Blood Bank. Resource status not applicable.</div>
                  </div>
                </div>
                )}
              </div>
              )}

              {/* AMBULANCE OVERVIEW */}
              {currentHospital && currentHospital.type === 'hospital' && hospitalMetrics && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #10b981',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} style={{ color: '#10b981' }} />
                  Ambulance Fleet Status
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>AVAILABLE</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{hospitalMetrics.availableAmbulances}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Ready for dispatch</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>DISPATCHED</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{hospitalMetrics.dispatchedAmbulances}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>On active duty</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>MAINTENANCE</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{hospitalMetrics.maintenanceAmbulances}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Under repair</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>TOTAL FLEET</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{hospitalMetrics.totalAmbulances}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>All ambulances</div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <button style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    Dispatch Available Ambulance
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    View Fleet Details
                  </button>
                </div>
              </div>
              )}
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
                  City-Wise Blood Requirements
                </h3>
                <Table
                  headers={['City', 'Zone', 'Blood Group', 'Units Needed', 'Hospital Name', 'Demand Level']}
                  data={mockCityEmergencies.map((city) => [
                    city.city,
                    city.zone,
                    <span style={{ fontWeight: 'bold', color: '#dc2626' }}>
                      {city.criticalBloodGroup}
                    </span>,
                    city.unitsNeeded,
                    city.hospitalName,
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
