import React from 'react';
import { Droplet, AlertTriangle, Package, Clock, TrendingUp } from 'lucide-react';
import { Card, Table, Badge, Button } from '../common/UIComponents';
import { mockBloodInventory } from '../../data/bloodInventory';
import { mockBloodRequests } from '../../data/bloodRequests';
import { mockDonors } from '../../data/donors';
import { matchDonorsToRequest, daysUntilExpiry, formatDateTime, getStatusColor } from '../../utils/bloodMatchingEngine';

interface HospitalDashboardProps {
  hospitalId: string;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ hospitalId }) => {
  // Filter inventory for this hospital
  const hospitalInventory = mockBloodInventory.filter(inv => inv.hospitalId === hospitalId);
  
  // Filter requests for this hospital
  const hospitalRequests = mockBloodRequests.filter(req => req.hospitalId === hospitalId);
  const emergencyRequests = hospitalRequests.filter(r => r.urgency === 'emergency' && r.status === 'pending');
  
  // Low stock alerts
  const lowStock = hospitalInventory.filter(inv => inv.unitsAvailable < inv.reorderThreshold);
  
  // Expiring soon (within 7 days)
  const expiringSoon = hospitalInventory.filter(inv => {
    const days = daysUntilExpiry(inv.expiryDate);
    return days <= 7 && days > 0;
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          Hospital Dashboard
        </h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>Manage inventory and emergency requests</p>
      </div>

      {/* Alert Banner */}
      {(lowStock.length > 0 || expiringSoon.length > 0) && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ margin: 0, fontWeight: '600', color: '#991b1b', marginBottom: '4px' }}>
              Inventory Alerts
            </p>
            {lowStock.length > 0 && (
              <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
                • {lowStock.length} blood type(s) below reorder threshold
              </p>
            )}
            {expiringSoon.length > 0 && (
              <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
                • {expiringSoon.length} unit(s) expiring within 7 days
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <Card
          title="Total Blood Units"
          value={hospitalInventory.reduce((sum, inv) => sum + inv.unitsAvailable, 0)}
          icon={<Droplet size={24} />}
          color="#3b82f6"
        />
        <Card
          title="Reserved Units"
          value={hospitalInventory.reduce((sum, inv) => sum + inv.unitsReserved, 0)}
          icon={<Package size={24} />}
          color="#8b5cf6"
        />
        <Card
          title="Low Stock Alerts"
          value={lowStock.length}
          icon={<AlertTriangle size={24} />}
          color="#dc2626"
        />
        <Card
          title="Emergency Requests"
          value={emergencyRequests.length}
          icon={<Clock size={24} />}
          color="#f59e0b"
        />
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        
        {/* Blood Inventory Panel */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Blood Inventory
          </h2>
          <Table
            headers={['Blood Group', 'Available', 'Reserved', 'Expiry', 'Status']}
            data={hospitalInventory.map(inv => {
              const days = daysUntilExpiry(inv.expiryDate);
              const isLow = inv.unitsAvailable < inv.reorderThreshold;
              const isExpiring = days <= 7;
              
              return [
                <span style={{ fontWeight: 'bold' }}>{inv.bloodGroup}</span>,
                <span style={{ color: isLow ? '#dc2626' : '#374151', fontWeight: isLow ? 'bold' : 'normal' }}>
                  {inv.unitsAvailable} {isLow && '⚠️'}
                </span>,
                inv.unitsReserved,
                <span style={{ color: isExpiring ? '#f59e0b' : '#6b7280', fontSize: '13px' }}>
                  {days} days {isExpiring && '⏰'}
                </span>,
                isLow ? (
                  <Badge color="#dc2626">Low Stock</Badge>
                ) : (
                  <Badge color="#10b981">Good</Badge>
                ),
              ];
            })}
          />
        </div>

        {/* Emergency Requests */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Emergency Requests
          </h2>
          {emergencyRequests.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              No emergency requests at the moment
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {emergencyRequests.map(req => {
                const matches = matchDonorsToRequest(req, mockDonors, 10);
                return (
                  <div key={req.id} style={{
                    border: '1px solid #fee2e2',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#fef2f2',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{req.patientName}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                          {formatDateTime(req.requestDate)}
                        </p>
                      </div>
                      <Badge color="#dc2626">{req.urgency}</Badge>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Blood Type</p>
                        <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{req.bloodGroup}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Units Needed</p>
                        <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{req.unitsRequired}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                        {matches.length} nearby donor(s) matched
                      </p>
                      <Button size="sm">View Donors</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All Requests */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            All Blood Requests
          </h2>
          <Table
            headers={['Patient', 'Blood Type', 'Units', 'Urgency', 'Status']}
            data={hospitalRequests.map(req => [
              req.patientName,
              req.bloodGroup,
              req.unitsRequired,
              <Badge color={req.urgency === 'emergency' ? '#dc2626' : '#16a34a'}>
                {req.urgency}
              </Badge>,
              <Badge color={getStatusColor(req.status)}>{req.status}</Badge>,
            ])}
          />
        </div>

        {/* Reports Summary */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Monthly Reports
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Total Donations (Feb)</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>
                    24
                  </p>
                </div>
                <TrendingUp size={32} color="#10b981" />
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Requests Fulfilled</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>
                    18
                  </p>
                </div>
                <Package size={32} color="#3b82f6" />
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Emergency Fulfillment Rate</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>
                    89%
                  </p>
                </div>
                <Clock size={32} color="#f59e0b" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
