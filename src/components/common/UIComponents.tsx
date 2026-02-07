import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, icon, color = '#3b82f6', subtitle }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{title}</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{value}</p>
          {subtitle && <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{subtitle}</p>}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface TableProps {
  headers: string[];
  data: React.ReactNode[][];
}

export const Table: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            {headers.map((header, index) => (
              <th key={index} style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f9fafb',
            }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{
                  padding: '12px',
                  fontSize: '14px',
                  color: '#374151',
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  color: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color }) => {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: `${color}20`,
      color: color,
    }}>
      {children}
    </span>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', size = 'md', type = 'button' }) => {
  const colors = {
    primary: { bg: '#3b82f6', hover: '#2563eb' },
    secondary: { bg: '#6b7280', hover: '#4b5563' },
    danger: { bg: '#dc2626', hover: '#b91c1c' },
  };
  
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '10px 20px', fontSize: '16px' },
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        backgroundColor: colors[variant].bg,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: sizes[size].padding,
        fontSize: sizes[size].fontSize,
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors[variant].hover}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors[variant].bg}
    >
      {children}
    </button>
  );
};
