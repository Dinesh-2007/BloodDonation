import React, { useMemo, useState } from 'react';
import { AlertCircle, Droplet, MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { Card, Table, Badge, Button } from '../common/UIComponents';
import { mockBloodRequests } from '../../data/bloodRequests';
import { mockHospitals } from '../../data/hospitals';
import { mockNotifications } from '../../data/notifications';
import { BloodGroup, BloodRequest, Notification } from '../../types';
import { formatDateTime, getStatusColor } from '../../utils/bloodMatchingEngine';

interface RequesterDashboardProps {
  userId: string;
}

export const RequesterDashboard: React.FC<RequesterDashboardProps> = ({ userId }) => {
  const requestsStorageKey = `requester_requests_${userId}`;
  const notificationsStorageKey = `requester_notifications_${userId}`;

  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    const stored = localStorage.getItem(requestsStorageKey);
    if (stored) {
      try {
        return JSON.parse(stored) as BloodRequest[];
      } catch {
        localStorage.removeItem(requestsStorageKey);
      }
    }
    const initialRequests = mockBloodRequests.filter(r => r.requesterId === userId);
    localStorage.setItem(requestsStorageKey, JSON.stringify(initialRequests));
    return initialRequests;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem(notificationsStorageKey);
    if (stored) {
      try {
        return JSON.parse(stored) as Notification[];
      } catch {
        localStorage.removeItem(notificationsStorageKey);
      }
    }
    const initialNotifications = mockNotifications.filter(n => n.userId === userId);
    localStorage.setItem(notificationsStorageKey, JSON.stringify(initialNotifications));
    return initialNotifications;
  });

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+' as BloodGroup,
    unitsRequired: 1,
    hospitalId: '',
    urgency: 'normal' as 'normal' | 'emergency',
    notes: '',
  });

  // Get notifications
  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications]
  );

  // Get requests made by this user
  const userRequests = useMemo(
    () => requests
      .filter(r => r.requesterId === userId)
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()),
    [requests, userId]
  );

  const pendingRequests = userRequests.filter(r => r.status === 'pending');
  const completedRequests = userRequests.filter(r => r.status === 'completed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hospital = mockHospitals.find(h => h.id === formData.hospitalId);
    if (!hospital) {
      return;
    }

    const newRequest: BloodRequest = {
      id: `req-${Date.now()}`,
      requesterId: userId,
      patientName: formData.patientName.trim(),
      bloodGroup: formData.bloodGroup,
      unitsRequired: Number.isFinite(formData.unitsRequired) ? formData.unitsRequired : 1,
      hospitalName: hospital.name,
      hospitalId: hospital.id,
      location: hospital.location,
      urgency: formData.urgency,
      status: 'pending',
      requestDate: new Date().toISOString(),
      fulfillmentDate: null,
      assignedDonorId: null,
      notes: formData.notes.trim(),
    };

    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem(requestsStorageKey, JSON.stringify(updatedRequests));

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      type: 'request-update',
      title: 'Request Acknowledged',
      message: `Your ${formData.urgency} blood request for ${formData.bloodGroup} has been received and is being processed.`,
      read: false,
      createdAt: new Date().toISOString(),
      metadata: {
        requestId: newRequest.id,
        bloodGroup: newRequest.bloodGroup,
        hospitalId: newRequest.hospitalId,
      },
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(notificationsStorageKey, JSON.stringify(updatedNotifications));

    setFormData({
      patientName: '',
      bloodGroup: 'O+',
      unitsRequired: 1,
      hospitalId: '',
      urgency: 'normal',
      notes: '',
    });
    setShowRequestForm(false);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Blood Request Dashboard
          </h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Request blood and track your requests</p>
        </div>
        <Button onClick={() => setShowRequestForm(!showRequestForm)}>
          + New Blood Request
        </Button>
      </div>

      {/* Create Request Form */}
      {showRequestForm && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
            Create Blood Request
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                    Units Required *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.unitsRequired}
                    onChange={(e) => setFormData({ ...formData, unitsRequired: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                    Hospital *
                  </label>
                  <select
                    required
                    value={formData.hospitalId}
                    onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">Select Hospital</option>
                    {mockHospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                  Urgency Level *
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="radio"
                      value="normal"
                      checked={formData.urgency === 'normal'}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'normal' })}
                    />
                    <span style={{ fontSize: '14px' }}>Normal</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="radio"
                      value="emergency"
                      checked={formData.urgency === 'emergency'}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'emergency' })}
                    />
                    <span style={{ fontSize: '14px', color: '#dc2626' }}>Emergency</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <Card
          title="Total Requests"
          value={userRequests.length}
          icon={<Droplet size={24} />}
          color="#3b82f6"
        />
        <Card
          title="Pending"
          value={pendingRequests.length}
          icon={<Clock size={24} />}
          color="#f59e0b"
        />
        <Card
          title="Completed"
          value={completedRequests.length}
          icon={<CheckCircle size={24} />}
          color="#10b981"
        />
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        
        {/* My Requests */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            My Blood Requests
          </h2>
          {userRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <AlertCircle size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>No requests yet</p>
              <Button onClick={() => setShowRequestForm(true)}>Create Your First Request</Button>
            </div>
          ) : (
            <Table
              headers={['Patient', 'Blood Type', 'Units', 'Hospital', 'Status']}
              data={userRequests.map(req => {
                const hospital = mockHospitals.find(h => h.id === req.hospitalId);
                return [
                  req.patientName,
                  <span style={{ fontWeight: 'bold' }}>{req.bloodGroup}</span>,
                  req.unitsRequired,
                  hospital?.name.substring(0, 20) || 'N/A',
                  <Badge color={getStatusColor(req.status)}>{req.status}</Badge>,
                ];
              })}
            />
          )}
        </div>

        {/* Request Details */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Request Status Details
          </h2>
          {userRequests.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              No requests to display
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userRequests.slice(0, 3).map(req => {
                const hospital = mockHospitals.find(h => h.id === req.hospitalId);
                return (
                  <div key={req.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: req.urgency === 'emergency' ? '#fef2f2' : '#f9fafb',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>
                          {req.patientName}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          Request ID: {req.id}
                        </p>
                      </div>
                      <Badge color={getStatusColor(req.status)}>{req.status}</Badge>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Blood Type</p>
                        <p style={{ margin: 0, fontWeight: '600', color: '#dc2626' }}>{req.bloodGroup}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Units</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{req.unitsRequired}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Urgency</p>
                        <Badge color={req.urgency === 'emergency' ? '#dc2626' : '#16a34a'}>
                          {req.urgency}
                        </Badge>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Date</p>
                        <p style={{ margin: 0, fontSize: '13px' }}>{formatDateTime(req.requestDate)}</p>
                      </div>
                    </div>

                    <div style={{
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '12px',
                      marginTop: '12px',
                    }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Hospital</p>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{hospital?.name}</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                        📍 {req.location.city}, {req.location.state}
                      </p>
                    </div>

                    {req.notes && (
                      <div style={{
                        marginTop: '12px',
                        padding: '8px',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#6b7280',
                      }}>
                        Note: {req.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Panel */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Contact Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Phone size={20} color="#3b82f6" />
                <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>Emergency Helpline</p>
              </div>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
                1-800-BLOOD-911
              </p>
            </div>

            {userRequests.slice(0, 2).map(req => {
              const hospital = mockHospitals.find(h => h.id === req.hospitalId);
              if (!hospital) return null;
              
              return (
                <div key={req.id} style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    {hospital.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Phone size={16} color="#6b7280" />
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{hospital.phone}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#6b7280" />
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      {hospital.location.city}, {hospital.location.state}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Notifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedNotifications.slice(0, 5).map(notif => (
              <div key={notif.id} style={{
                padding: '12px',
                backgroundColor: notif.read ? '#f9fafb' : '#eff6ff',
                borderRadius: '6px',
                border: `1px solid ${notif.read ? '#e5e7eb' : '#bfdbfe'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
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
      </div>
    </div>
  );
};
