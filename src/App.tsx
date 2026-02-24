import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/auth/Login';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { HospitalDashboard } from './components/dashboards/HospitalDashboard';
import { DonorDashboard } from './components/dashboards/DonorDashboard';
import { RequesterDashboard } from './components/dashboards/RequesterDashboard';
import { mockUsers } from './data/users';
import { User } from './types';
import { LogOut, User as UserIcon } from 'lucide-react';

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRole, 
  currentUser 
}: { 
  children: React.ReactNode; 
  allowedRole: string; 
  currentUser: User | null;
}) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== allowedRole) {
    // Redirect to their own dashboard
    return <Navigate to={`/${currentUser.role}`} replace />;
  }
  
  return <>{children}</>;
}

// Layout Component with Navigation
function DashboardLayout({ 
  currentUser, 
  onLogout, 
  children 
}: { 
  currentUser: User | null; 
  onLogout: () => void; 
  children: React.ReactNode;
}) {
  if (!currentUser) return null;
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            🩸
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
          }}>
            <UserIcon size={18} color="#6b7280" />
            <div>
              <input
                type="text"
                defaultValue={currentUser.name}
                placeholder="John Smith"
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '2px 4px',
                  width: '150px',
                }}
              />
              <input
                type="email"
                defaultValue={currentUser.email}
                placeholder="donor@example.com"
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '2px 4px',
                  width: '150px',
                }}
              />
            </div>
          </div>
          
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      {children}
    </div>
  );
}

// Login Route Handler
function LoginRoute({ currentUser, onLogin }: { currentUser: User | null; onLogin: (user: User) => void }) {
  // If already logged in, redirect to their dashboard
  if (currentUser) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <Login onLogin={onLogin} users={mockUsers} />;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={<LoginRoute currentUser={currentUser} onLogin={handleLogin} />} 
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin" currentUser={currentUser}>
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Hospital Route */}
        <Route
          path="/hospital"
          element={
            <ProtectedRoute allowedRole="hospital" currentUser={currentUser}>
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <HospitalDashboard hospitalId="hospital-001" />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Donor Route */}
        <Route
          path="/donor"
          element={
            <ProtectedRoute allowedRole="donor" currentUser={currentUser}>
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                {currentUser && <DonorDashboard userId={currentUser.id} />}
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Requester Route */}
        <Route
          path="/requester"
          element={
            <ProtectedRoute allowedRole="requester" currentUser={currentUser}>
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                {currentUser && <RequesterDashboard userId={currentUser.id} />}
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Route - Redirect to login or user's dashboard */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to={`/${currentUser.role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 - Redirect to appropriate page */}
        <Route
          path="*"
          element={
            currentUser ? (
              <Navigate to={`/${currentUser.role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
