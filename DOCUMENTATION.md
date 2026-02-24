# Blood Donation Management System - Complete Documentation

## 🎯 Project Overview

A comprehensive blood donation and management platform with **role-based dashboards** for Admins, Hospitals/Blood Banks, Donors, and Requesters.

## 🚀 Quick Start

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@bloodbank.com | admin123 |
| **Hospital** | hospital@example.com | hospital123 |
| **Donor** | donor@example.com | donor123 |
| **Requester** | requester@example.com | requester123 |

## 📁 Project Structure

```
labchef/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.tsx              # Login page with role-based access
│   │   ├── common/
│   │   │   └── UIComponents.tsx       # Reusable UI components
│   │   └── dashboards/
│   │       ├── AdminDashboard.tsx     # Admin control center
│   │       ├── HospitalDashboard.tsx  # Hospital inventory management
│   │       ├── DonorDashboard.tsx     # Donor profile & history
│   │       └── RequesterDashboard.tsx # Request blood & track status
│   ├── data/
│   │   ├── users.ts                   # Mock user accounts
│   │   ├── donors.ts                  # Mock donor profiles (10 donors)
│   │   ├── hospitals.ts               # Mock hospitals/blood banks (5 facilities)
│   │   ├── bloodInventory.ts          # Mock blood inventory (15+ entries)
│   │   ├── bloodRequests.ts           # Mock blood requests (8 requests)
│   │   ├── donationHistory.ts         # Mock donation history (16 donations)
│   │   ├── notifications.ts           # Mock notifications (16 notifications)
│   │   └── analytics.ts               # Mock analytics data
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   ├── utils/
│   │   └── bloodMatchingEngine.ts     # Matching algorithm & utilities
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   └── index.css                      # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎭 User Roles & Features

### 1️⃣ Admin Dashboard

**Key Metrics Cards:**
- Total Registered Donors
- Active Donors (eligible)
- Blood Requests Today
- Pending Requests
- Successful Donations
- Critical Shortage Alerts

**Core Modules:**
- **Donor Management**: View all donors with ID, name, blood group, location, eligibility status
- **Blood Inventory Overview**: Monitor inventory across all hospitals with alerts for low stock
- **Request Management**: Track all blood requests with urgency levels and status
- **Hospital/Blood Bank List**: Manage registered facilities with verification status
- **Monthly Analytics**: Visualize donation and request trends

### 2️⃣ Hospital/Blood Bank Dashboard

**Features:**
- **Inventory Panel**: Track blood units by group with expiry dates and reorder thresholds
- **Low Stock Alerts**: Visual warnings for inventory below thresholds
- **Expiry Warnings**: Track units expiring within 7 days
- **Emergency Requests**: View and manage emergency blood requests
- **Auto-Match Donors**: System suggests nearby compatible donors
- **Monthly Reports**: Statistics on donations, fulfillment rates

**Inventory Tracking:**
- Blood Group
- Units Available
- Units Reserved
- Expiry Countdown
- Reorder Threshold
- Status Indicators

### 3️⃣ Donor Dashboard

**Profile Information:**
- Blood Group, Age, Weight
- Medical Eligibility Status
- Last Donation Date
- Next Eligible Date (auto-calculated)
- Total Donations Count

**Features:**
- **Emergency Alerts**: Get notified of matching emergency requests nearby
- **Donation History**: Complete history with dates, hospitals, units donated
- **Location Settings**: Set preferred donation radius (5km/10km/25km)
- **Eligibility Tracking**: Automatic 90-day gap calculation
- **Quick Accept/Decline**: One-click response to emergency requests

### 4️⃣ Requester/Patient Dashboard

**Create Blood Request:**
- Patient Name
- Blood Group Required
- Units Needed
- Hospital Selection
- Urgency Level (Normal/Emergency)
- Additional Notes

**Request Tracking:**
- Status Updates (Pending → Donor Matched → In Progress → Completed)
- Assigned Hospital Information
- Emergency Helpline
- Live Notifications

**Request Status Types:**
- Pending
- Donor Matched
- In Progress
- Completed
- Cancelled

## 🧬 Blood Matching Engine

Located in `src/utils/bloodMatchingEngine.ts`

**Key Features:**

### Blood Compatibility Matrix
```typescript
O- → Can donate to: All blood types (Universal Donor)
O+ → Can donate to: O+, A+, B+, AB+
A- → Can donate to: A-, A+, AB-, AB+
A+ → Can donate to: A+, AB+
B- → Can donate to: B-, B+, AB-, AB+
B+ → Can donate to: B+, AB+
AB- → Can donate to: AB-, AB+
AB+ → Can receive from: All blood types (Universal Receiver)
```

### Matching Algorithm
```typescript
matchDonorsToRequest(request, donors, maxDistance) {
  // 1. Check blood group compatibility
  // 2. Calculate GPS distance
  // 3. Check donor eligibility (90-day gap)
  // 4. Calculate match score
  // 5. Sort by best match
}
```

**Match Score Calculation:**
- Base score: 100
- Distance penalty: -2 per km
- Not eligible: -30
- Different blood type: -10
- Medical status pending: -20
- Contact not verified: -15
- Emergency + eligible bonus: +20

### Distance Calculation
Uses **Haversine formula** for accurate GPS distance:
```typescript
calculateDistance(location1, location2) → distance in km
```

### Eligibility Rules
- Minimum 90-day gap between donations
- Age: 18-65 years
- Weight: minimum 50 kg
- Medical approval required

## 📊 Mock Data Overview

### Users (17 total)
- 1 Admin
- 5 Hospitals/Blood Banks
- 10 Donors
- 3 Requesters

### Donors (10 profiles)
- Various blood groups: O+, O-, A+, A-, B+, B-, AB+, AB-
- Different locations: NY, LA, Chicago, Houston, Phoenix, etc.
- Mixed eligibility statuses
- Contact verification states

### Hospitals (5 facilities)
- City General Hospital (NY)
- Red Cross Blood Bank (LA)
- Mercy Medical Center (Chicago)
- St. Mary's Hospital (Houston)
- Phoenix Blood Center (Phoenix)

### Blood Inventory (15+ entries)
- Covers all 8 blood groups
- Multiple hospitals
- Expiry tracking
- Low stock scenarios included

### Blood Requests (8 requests)
- Mix of Normal and Emergency
- Various statuses (Pending, Matched, In Progress, Completed)
- Different blood groups
- Realistic scenarios

### Donation History (16 records)
- Distributed across multiple donors
- Different hospitals
- Completed donations
- Request associations

### Notifications (16 notifications)
- Role-specific notifications
- Emergency alerts
- Low stock warnings
- Request updates
- Eligibility reminders

## 🔔 Notification System

**Types:**
1. **Emergency** - Urgent blood requests
2. **Low Stock** - Inventory alerts
3. **Eligibility** - Donation eligibility updates
4. **Request Update** - Status changes
5. **Donation Reminder** - Periodic reminders

**Channels** (Simulated):
- Email notifications
- SMS alerts
- In-app notifications

## 🎨 UI Components

### Reusable Components (src/components/common/UIComponents.tsx)
- **Card**: Metric cards with icon, title, value, subtitle
- **Table**: Data tables with headers and rows
- **Badge**: Status badges with color coding
- **Button**: Styled buttons with variants (primary, secondary, danger)

### Color Coding
- **Red (#dc2626)**: Emergency, Critical, Blood
- **Green (#10b981)**: Success, Completed, Eligible
- **Blue (#3b82f6)**: Info, Primary Actions
- **Orange (#f59e0b)**: Warning, Pending
- **Purple (#8b5cf6)**: Special Status, Blood Bank

## 🔐 Security Features (Simulated)

- Role-based access control (RBAC)
- Email + Password authentication
- User session management
- Contact verification tracking
- Medical approval workflow

## 🗺️ Location Features

**GPS Coordinates:**
- All donors have lat/long coordinates
- All hospitals/blood banks have locations
- Distance calculation for matching
- Radius-based filtering

**Cities Represented:**
- New York, NY
- Los Angeles, CA
- Chicago, IL
- Houston, TX
- Phoenix, AZ
- Philadelphia, PA
- San Antonio, TX
- San Diego, CA
- Dallas, TX
- San Jose, CA

## 📈 Analytics Dashboard

**Metrics Tracked:**
- Total Donors: 10
- Active Donors: 5
- Today's Requests: 5
- Pending Requests: 3
- Successful Donations: 16
- Critical Shortages: O-, AB-, B-

**Monthly Trends:**
- Donations per month
- Requests per month
- Emergency response time: 4.5 hours
- Donor engagement rate: 65.5%

## 🛠️ Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server
- **Lucide React**: Icon library
- **Inline CSS**: Styling (no external CSS framework)

## 🎯 Key Highlights

1. **Complete Mock Data**: All entities (users, donors, hospitals, inventory, requests, history, notifications)
2. **Role-Based Dashboards**: 4 different user experiences
3. **Smart Matching Engine**: Blood compatibility + GPS distance + eligibility
4. **Real-Time Alerts**: Emergency notifications for matching donors
5. **Inventory Management**: Low stock alerts, expiry tracking
6. **Request Tracking**: Full lifecycle from pending to completed
7. **Donation History**: Complete audit trail
8. **Analytics**: Data visualization and trends

## 🚀 Next Steps (Future Enhancements)

1. **Backend Integration**
   - Node.js + Express API
   - MongoDB with GeoJSON
   - Real-time WebSocket notifications

2. **Authentication**
   - OTP-based login
   - JWT tokens
   - OAuth integration

3. **Maps Integration**
   - Google Maps API
   - Route navigation
   - Hospital locator

4. **Advanced Features**
   - SMS notifications (Twilio)
   - Email service (SendGrid)
   - Push notifications
   - QR code verification
   - Blood drive scheduling

5. **Security**
   - Data encryption
   - Activity logs
   - Fake request detection
   - HIPAA compliance

## 📝 Usage Examples

### Donor Workflow
1. Login as donor
2. View profile with blood group and eligibility
3. Receive emergency alert for matching request
4. Accept/Decline request
5. Navigate to hospital
6. Complete donation
7. View updated history

### Requester Workflow
1. Login as requester
2. Click "New Blood Request"
3. Enter patient details and blood type
4. Select hospital and urgency
5. Submit request
6. Track status updates
7. Contact hospital when matched

### Hospital Workflow
1. Login as hospital
2. Monitor blood inventory
3. Receive low stock alerts
4. View emergency requests
5. See matched donors
6. Update request status
7. Generate reports

### Admin Workflow
1. Login as admin
2. Monitor all system metrics
3. Review critical shortages
4. Manage donors and hospitals
5. Approve/reject facilities
6. View analytics
7. Configure system rules

## 🎓 Learning Resources

This project demonstrates:
- React component architecture
- TypeScript type system
- State management
- Role-based UI rendering
- Data modeling
- Algorithm implementation (matching)
- Mock data generation
- Responsive design (inline styles)

---

**Built with ❤️ for saving lives through technology**
