# 🗺️ Application Routes

## Route Structure

The application now uses **React Router** with role-based route protection.

## Available Routes

### 🔓 Public Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Login page | Everyone |

### 🔒 Protected Routes (Role-Based)

| Route | Dashboard | Required Role | Description |
|-------|-----------|---------------|-------------|
| `/admin` | Admin Dashboard | `admin` | System control center |
| `/hospital` | Hospital Dashboard | `hospital` | Inventory & emergency management |
| `/donor` | Donor Dashboard | `donor` | Donor profile & history |
| `/requester` | Requester Dashboard | `requester` | Blood request management |

### 🏠 Default Routes

| Route | Behavior |
|-------|----------|
| `/` | Redirects to login (if not logged in) or user's dashboard (if logged in) |
| `*` (404) | Redirects to login or user's dashboard |

## Route Protection Logic

### ✅ Access Rules

1. **Not Logged In**
   - Can only access `/login`
   - Any other route → Redirect to `/login`

2. **Logged In (Any Role)**
   - Cannot access `/login` (auto-redirects to their dashboard)
   - Can only access their own role's dashboard
   - Trying to access another role's dashboard → Redirect to their own dashboard

3. **Auto-Navigation**
   - After login → Automatically navigate to role-specific dashboard
   - After logout → Redirect to `/login`

## Examples

### Example 1: Admin User
```
Login as: admin@bloodbank.com
After login: Automatically navigate to /admin
Try to visit /hospital: Redirected back to /admin ✅
Try to visit /donor: Redirected back to /admin ✅
```

### Example 2: Hospital User
```
Login as: hospital@example.com
After login: Automatically navigate to /hospital
Try to visit /admin: Redirected back to /hospital ✅
Try to visit /donor: Redirected back to /hospital ✅
```

### Example 3: Donor User
```
Login as: donor@example.com
After login: Automatically navigate to /donor
Try to visit /admin: Redirected back to /donor ✅
Try to visit /requester: Redirected back to /donor ✅
```

### Example 4: Requester User
```
Login as: requester@example.com
After login: Automatically navigate to /requester
Try to visit /hospital: Redirected back to /requester ✅
Try to visit /admin: Redirected back to /requester ✅
```

## Testing Routes

### Method 1: Direct URL Access
1. Start the app: `npm run dev`
2. Open browser: `http://localhost:5173`
3. Try accessing routes directly:
   - `http://localhost:5173/admin` → Redirects to login (not logged in)
   - Login as admin → Access `http://localhost:5173/admin` ✅

### Method 2: Quick Login & Navigation
1. Go to `http://localhost:5173/login`
2. Use quick login buttons
3. Automatically navigated to your dashboard
4. Try manually changing URL to other roles
5. See automatic redirect back to your dashboard

## URL Examples

```bash
# Base URL
http://localhost:5173

# Login page
http://localhost:5173/login

# Admin dashboard (admin only)
http://localhost:5173/admin

# Hospital dashboard (hospital only)
http://localhost:5173/hospital

# Donor dashboard (donor only)
http://localhost:5173/donor

# Requester dashboard (requester only)
http://localhost:5173/requester
```

## Test Accounts

| Role | Email | Password | Dashboard Route |
|------|-------|----------|-----------------|
| Admin | admin@bloodbank.com | admin123 | `/admin` |
| Hospital | hospital@example.com | hospital123 | `/hospital` |
| Donor | donor@example.com | donor123 | `/donor` |
| Requester | requester@example.com | requester123 | `/requester` |

## Implementation Details

### Key Features

✅ **Role-Based Access Control (RBAC)**
- Each route checks user's role
- Unauthorized access → Automatic redirect

✅ **Protected Routes**
- Wrapped with `ProtectedRoute` component
- Validates authentication + authorization

✅ **Auto-Navigation**
- Login success → Navigate to role dashboard
- Direct URL access → Check permissions first

✅ **Session Persistence**
- User state maintained in React state
- Logout clears user and redirects to login

### Components

1. **ProtectedRoute Component**
   - Checks if user is logged in
   - Validates user role matches required role
   - Redirects if unauthorized

2. **DashboardLayout Component**
   - Common layout for all dashboards
   - Navigation bar with user info
   - Logout button

3. **LoginRoute Component**
   - Handles login page
   - Auto-redirects if already logged in

## Browser Navigation

### Forward/Back Buttons
- ✅ Work correctly with React Router
- ✅ Respects route protection rules
- ✅ Maintains navigation history

### Bookmarks
- ✅ Can bookmark specific routes
- ✅ Route protection applies on bookmark access
- ✅ Redirects to login if not authenticated

## Security

### Route Protection
- ✅ Client-side validation (React Router)
- ✅ Role-based access control
- ✅ Automatic redirects for unauthorized access

### Note
⚠️ This is client-side protection only. In production, you would need:
- Backend API authentication (JWT tokens)
- Server-side route protection
- API endpoint authorization

## Troubleshooting

### Issue: Redirected to login after refresh
**Cause**: User state not persisted (currently in-memory only)
**Solution**: Add localStorage or backend session management

### Issue: Can't access a specific route
**Cause**: User role doesn't match route requirement
**Solution**: Check your logged-in user's role

### Issue: Stuck on login page
**Cause**: Navigation might be blocked
**Solution**: Check browser console for errors

## Future Enhancements

1. **localStorage** - Persist user session across page refreshes
2. **JWT Tokens** - Secure authentication with backend
3. **Route Guards** - More complex permission checks
4. **Route Params** - Dynamic routes like `/donor/:donorId`
5. **Query Params** - Filter/search parameters in URL
6. **Breadcrumbs** - Navigation breadcrumb trail
7. **Route Transitions** - Smooth page transitions

---

**Status**: ✅ Routes Implemented & Working
**Protection**: ✅ Role-Based Access Control
**Navigation**: ✅ Auto-redirect on login/logout
