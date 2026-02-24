import React, { useState } from 'react';
import { Heart, Lock, Mail } from 'lucide-react';
import { User } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  const quickLogin = (role: string) => {
    const testAccounts = {
      admin: { email: 'admin@bloodbank.com', password: 'admin123' },
      hospital: { email: 'hospital@example.com', password: 'hospital123' },
      donor: { email: 'donor@example.com', password: 'donor123' },
      requester: { email: 'requester@example.com', password: 'requester123' },
      camp: { email: 'camp@bloodbank.com', password: 'camp123' },
    };
    
    const account = testAccounts[role as keyof typeof testAccounts];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#dc2626',
            marginBottom: '16px',
          }}>
            <Heart size={32} color="white" fill="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Blood Donation System
          </h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>
            Saving lives, one donation at a time
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#9ca3af"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#9ca3af"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                marginBottom: '16px',
                color: '#991b1b',
                fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              Sign In
            </button>
          </form>

          {/* Quick Login */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', textAlign: 'center' }}>
              Quick login for demo:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <button
                onClick={() => quickLogin('admin')}
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('hospital')}
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Hospital
              </button>
              <button
                onClick={() => quickLogin('donor')}
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Donor
              </button>
              <button
                onClick={() => quickLogin('requester')}
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Requester
              </button>
              <button
                onClick={() => quickLogin('camp')}
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151',
                  gridColumn: 'span 2',
                }}
              >
                Camp
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '13px',
          color: '#6b7280',
        }}>
          © 2026 Blood Donation Management System
        </p>
      </div>
    </div>
  );
};
