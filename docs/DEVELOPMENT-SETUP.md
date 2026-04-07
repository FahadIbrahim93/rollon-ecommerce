---
title: Development Setup & Quick Start Guide
description: How to run RollON locally, test features, and start development
---

# RollON Development Setup & Testing Guide

**Status**: ✅ Application running on http://localhost:5173/  
**Date**: April 7, 2026  
**Environment**: Codespaces (Ubuntu 24.04)

---

## 🚀 QUICK START

### Prerequisites
- Node.js 18+ (already installed)
- npm 10+ (already installed)

### 1. Start Development Server ✅ ALREADY RUNNING
```bash
cd /workspaces/rollon-ecommerce/rollon-app
npm run dev
# Server running at http://localhost:5173/
```

**Terminal ID**: `cc16960c-85dd-4f57-8466-fd6a4a1fded6` (in background)

### 2. Open in Browser
- **Local**: http://localhost:5173/
- **Codespaces**: Click "Ports" tab (bottom left) → Open http://localhost:5173

---

## 👤 TEST CREDENTIALS

### Admin Account 🔑
```
Email: admin@rollon.com
Password: admin123
Role: Admin (full access)
```

### Customer Account 👥
```
Email: customer@example.com
Password: password123
Role: User
```

### Test Account 🧪
```
Email: test@example.com
Password: test1234
Role: User
```

---

## ✅ TESTING CHECKLIST

### 1. **Home Page** (Should load immediately)
- [ ] Visit http://localhost:5173/
- [ ] See featured products + hero banner
- [ ] Navbar displays: Logo, Search, Cart, Account
- [ ] Mobile responsive (shrink browser)

**Expected**: Everything loads, no console errors

---

### 2. **Shopping Flow** (Core functionality)

#### Browse Products
- [ ] Click "Shop" or navigate to `/shop`
- [ ] See product grid with categories
- [ ] Search works (type "bong" or "pipe")
- [ ] Filter by category works

#### Add to Cart
- [ ] Click product → See details page
- [ ] Click "Add to Cart"
- [ ] See cart count increase (top right)
- [ ] Click cart icon → See drawer open with items

#### Manage Cart
- [ ] Update quantity (+ / -)
- [ ] Remove items (X button)
- [ ] See total price update
- [ ] Close drawer (click outside or X)

**Expected**: Cart persists (refresh page, items still there)

---

### 3. **Account & Navigation** (User features)

#### Browse Without Account
- [ ] Do 1-3 above (works unauthenticated)
- [ ] Navigate to `/account` → Redirects to `/login`

#### Login
- [ ] Click "Account" button → Redirected to login
- [ ] Enter `admin@rollon.com / admin123`
- [ ] Click "Sign In"
- [ ] **Expected**: Redirect to `/admin` (admin user)
- [ ] **OR** Redirect to `/` → Click "Account" → See profile

#### Customer Login
- [ ] Logout (if admin)
- [ ] Login with `customer@example.com / password123`
- [ ] Click "Account" → See profile page
- [ ] Edit profile → Update name → Submit
- [ ] See "Profile updated" toast

#### Logout
- [ ] Click Account → Profile page → "Sign Out" button
- [ ] Logged out, redirected to home

**Expected**: Auth persists in localStorage (refresh page, still logged in)

---

### 4. **Admin Dashboard** 🔐 (Admin only)

#### Access Admin
- [ ] Login with `admin@rollon.com / admin123`
- [ ] Navigate to `/admin` or click "Admin" in navbar (if visible)
- [ ] Should see admin dashboard

#### Admin Sections
- [ ] **Dashboard**: Overview cards, analytics
- [ ] **Products**: List products, add/edit/delete
- [ ] **Orders**: View orders, update status
- [ ] **Customers**: List customers, view details

**Expected**: All admin pages load, no 404 errors

---

### 5. **Checkout Flow** (Payment flow)

#### Start Checkout
- [ ] Add item to cart
- [ ] Click "Checkout" or navigate to `/checkout`
- [ ] See checkout form with sections:
  - Contact Information
  - Shipping Address
  - Payment Method
  - Order Summary

#### Fill Form
- [ ] Enter email: `test@example.com`
- [ ] Enter name: `Test User`
- [ ] Enter address: `123 Main St, City, ST 12345`
- [ ] Enter phone: `555-0123`
- [ ] Select payment: COD or Card

#### Submit Order
- [ ] Click "Place Order"
- [ ] **Expected**: 
  - Form validates (required fields)
  - On success: Redirect to `/success`
  - See "Thank you" message + order number

**Note**: This may fail if backend API not running (that's OK for testing)

---

### 6. **Browser Console Check** (F12 → Console)

- [ ] Any red 🔴 errors? → Note for fixing
- [ ] Any yellow ⚠️ warnings? → Research
- [ ] Expected warnings:
  - React DevTools
  - Some external scripts
- [ ] No auth/security errors

**Good**: Console clean or only dev warnings

---

## 🛠️ DEVELOPMENT COMMANDS

Open NEW terminal (don't stop dev server):

```bash
cd /workspaces/rollon-ecommerce/rollon-app

# Code quality
npm run lint              # ESLint check
npm run lint -- --fix     # Auto-fix issues

# Type checking
npx tsc --noEmit          # Check TypeScript

# Testing
npm test -- --run         # Run all tests once
npm test -- --watch       # Watch mode (re-run on change)
npm test -- --coverage    # Coverage report

# Build
npm run build             # Production build
npm run preview           # Preview prod build locally

# Security
npm audit                 # Check dependencies
npm audit fix             # Auto-fix vulnerabilities
```

---

## 🔍 COMMON ISSUES & FIXES

### Issue: "Cannot find module @/..."
**Fix**: Path aliases not working
```bash
# Restart dev server
npm run dev
```

### Issue: Auth store shows `isAuthenticated = false`
**Fix**: Check localStorage
```javascript
// In browser console (F12)
localStorage.getItem('auth-state')
// Should contain user + token if logged in
```

### Issue: Admin routes redirect to login
**Fix**: Not logged in as admin
```
1. Click "Account" → "Sign In"
2. Use admin@rollon.com / admin123
3. Navigate /admin
```

### Issue: Styles not loading
**Fix**: Tailwind not compiled
```bash
npm run dev  # Should auto-compile Tailwind
```

### Issue: API calls fail (localhost refused)
**Fix**: Backend not needed for frontend testing
- App works with mock data (seeded in database store)
- API errors show in console but don't break app

---

## 📁 PROJECT STRUCTURE (Frontend)

```
rollon-app/
├── src/
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Home page
│   │   ├── Shop.tsx        # Products grid
│   │   ├── Cart.tsx        # Cart page
│   │   ├── Checkout.tsx    # Checkout form
│   │   ├── Login.tsx       # Login page
│   │   ├── Account.tsx     # User profile
│   │   └── admin/          # Admin pages
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminOrders.tsx
│   │       └── AdminCustomers.tsx
│   ├── components/         # Reusable components
│   │   ├── layout/         # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ...
│   │   ├── shop/           # Shop components
│   │   ├── checkout/       # Checkout components
│   │   ├── admin/          # Admin components
│   │   └── ...
│   ├── store/              # Zustand stores
│   │   ├── authStore.ts    # Auth state + login/logout
│   │   ├── cartStore.ts    # Cart state
│   │   ├── wishlistStore.ts
│   │   └── databaseStore.ts # Mock data
│   ├── lib/                # Utilities
│   │   ├── api.ts          # API client
│   │   ├── utils.ts        # Helpers
│   │   ├── checkoutSchema.ts # Form validation
│   │   └── ...
│   ├── App.tsx             # Main app + routes
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── package.json
└── vite.config.ts          # Build config
```

---

## 🎯 WHAT TO TEST TODAY

### Priority 1: Core Shopping Flow ⭐⭐⭐
1. Navigate shop
2. Search products
3. Add to cart
4. View cart
5. Start checkout

**Goal**: Confirm UI works, cart persists

### Priority 2: Authentication 🔐
1. Login with admin
2. See admin dashboard
3. Login with customer
4. See profile
5. Logout

**Goal**: Confirm auth flow works

### Priority 3: Forms & Validation ✅
1. Try checkout without fill
2. See validation errors
3. Fill correctly → Submit
4. See success/error toast

**Goal**: Confirm forms validated

### Priority 4: Performance & Responsiveness 📱
1. Open DevTools → Mobile mode
2. Test on small screen
3. Check Lighthouse (DevTools → Lighthouse tab)
4. Look for Layout Shift or slow loads

**Goal**: Confirm mobile friendly

---

## 🚀 NEXT DEVELOPMENT STEPS (Sprint 1)

After testing, we'll fix these in order:

### **T1.1**: Fix ProtectedRoute (2h)
- Test: Admin login → `/admin` works

### **T1.2**: API Auth Endpoint (4h)
- Replace mock fallback with real JWT

### **T1.3**: API Middleware (4h)
- Protect all `/api/*` routes

---

## 📊 SUCCESSFUL TEST CRITERIA

✅ **All** of these should work:
- Home page loads
- Shop browse/search works
- Add to cart works
- Cart persists (refresh page)
- Login/logout works
- Admin can access `/admin`
- Forms validate input
- No console errors (except dev warnings)

---

## 🆘 NEED HELP?

**If something fails**, check:
1. **Console errors** (F12 → Console tab)
2. **Network tab** (F12 → Network tab)
3. **Local storage** (F12 → Application → Local Storage)
4. **Terminal errors** (Check npm dev server output)

**Report with**:
- What you tried
- What you expected
- What actually happened
- Screenshot of error
- Console output

---

## 📝 TESTING NOTES

Use this section to record your testing results:

### ✅ What Worked
- [ ] Home page
- [ ] Shop page
- [ ] Search
- [ ] Add to cart
- [ ] Cart drawer
- [ ] Login
- [ ] Admin dashboard
- [ ] Logout

### ❌ What Failed
(Record issues here with error details)

### 🔧 Browser Console
(Copy any errors from F12 console here)

---

**Happy Testing! 🎉**

App is live at http://localhost:5173/ → Go check it out!

When done testing, let me know what works/breaks and we'll start fixing issues in Sprint 1.
