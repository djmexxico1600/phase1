## BeatForge Live Site Test Scenarios

Comprehensive testing guide for validating BeatForge functionality after deployment.

---

## Pre-Test Setup

### Environment
- **Browser**: Chrome/Firefox (latest)
- **Network**: Clear cookies/cache or use private window
- **Device**: Desktop (primary), Mobile (secondary)
- **Console**: Open DevTools (F12) to check for errors

### Test Account Credentials
Use unique emails for each test to avoid conflicts:
```
Producer: producer1@test.com / SecurePass123!
Buyer 1: buyer1@test.com / SecurePass123!
Buyer 2: buyer2@test.com / SecurePass123!
Admin: admin@test.com / SecurePass123!
```

---

## Scenario 1: User Registration Flow ✓

### Producer Registration
1. Navigate to: https://beatforge.pages.dev/auth/register
2. **Verify page loads**
   - [ ] Form visible with role selector
   - [ ] No console errors
   - [ ] Styling correct (fonts, colors)

3. **Select Producer role**
   - [ ] Click "Producer" button
   - [ ] Button shows active state

4. **Fill registration form**
   - Full Name: "Test Producer"
   - Email: producer1@test.com
   - Password: SecurePass123!
   - Confirm Password: SecurePass123!

5. **Submit form**
   - [ ] Form validates (required fields)
   - [ ] Loading state shows on button
   - [ ] No console errors

6. **Verify success**
   - [ ] Redirect to `/auth/verify-email`
   - [ ] Success message displays
   - [ ] Email verification page shows

### Buyer Registration
1. Repeat steps 1-2 but select "Buyer" role
2. Complete form with:
   - Email: buyer1@test.com
   - Other fields: same as producer
3. Verify redirect to verify-email page

### Expectations
- No form validation errors
- Success pages load quickly
- Email input accepts valid format
- Password strength validated

---

## Scenario 2: Authentication & Session ✓

### Login Success
1. Go to: https://beatforge.pages.dev/auth/login
2. Enter:
   - Email: producer1@test.com
   - Password: SecurePass123!
3. Click "Sign In"

4. **Verify login succeeded**
   - [ ] Redirect to `/dashboard` (if producer)
   - [ ] User name appears in header
   - [ ] Navigation sidebar visible
   - [ ] Session cookie set (DevTools → Cookies)

### Session Persistence
1. Refresh page (Cmd/Ctrl + R)
   - [ ] Still logged in (no redirect to login)
   - [ ] Dashboard data loads

2. Navigate to different page
   - [ ] Session maintained
   - [ ] User stays authenticated

3. Close browser tab, reopen URL
   - [ ] Session persists
   - [ ] Logged in automatically

### Login Failure
1. Go to login page
2. Enter:
   - Email: wrong@test.com
   - Password: WrongPassword
3. Click "Sign In"

4. **Verify error handling**
   - [ ] Error message displays: "Invalid credentials"
   - [ ] Page doesn't refresh
   - [ ] Not logged in

### Logout
1. Click user menu → "Logout"
2. **Verify logout succeeded**
   - [ ] Redirect to homepage
   - [ ] Session cookie removed
   - [ ] Navigating to `/dashboard` redirects to login

---

## Scenario 3: Marketplace Discovery ✓

### Browse Beats
1. As logged-in user, navigate to: `/marketplace/beats`
2. **Verify page loads**
   - [ ] Page title: "Browse Beats"
   - [ ] Grid layout visible
   - [ ] Filter panel on left (optional)
   - [ ] Search bar at top

3. **Check for test beats** (if seeded)
   - [ ] Beat cards display in grid
   - [ ] Shows: cover, title, producer, price
   - [ ] No console errors

4. **Try search**
   - Search for: "trap"
   - [ ] Search submits
   - [ ] Results filter (or empty state if no data)

### Beat Filtering
1. On `/marketplace/beats` page
2. Click "Genre" dropdown
   - [ ] List of genres appears
   - [ ] Can select multiple

3. Adjust "BPM Range" slider
   - [ ] Slider works smoothly
   - [ ] Min/max values update

4. Filter for price range
   - [ ] Price filters apply
   - [ ] Results update

### Sort Options
1. Click "Sort by" dropdown
   - [ ] Options: Newest, Popular, Price (Low→High), etc.
   - [ ] Selection changes sort order

### Pagination
1. Navigate through beat listing
2. If multiple pages exist:
   - [ ] "Next" button loads next page
   - [ ] "Previous" goes back
   - [ ] Page indicator shows current page

---

## Scenario 4: Beat Detail & Player ✓

### View Beat Details
1. Click on a beat card from marketplace
2. **Verify beat detail page loads**
   - [ ] URL: `/marketplace/beats/[slug]`
   - [ ] Beat cover image displays
   - [ ] Title, artist, genre, BPM show

3. **Check waveform player**
   - [ ] Waveform visual displays
   - [ ] Play button visible
   - [ ] Duration shows (e.g., "3:24")

### Audio Player Controls
1. Click play button
   - [ ] ⏯️ Play/pause works
   - [ ] Duration and current time display
   - [ ] Progress bar interactive

2. Adjust volume
   - [ ] Volume slider responds
   - [ ] Mute button works

3. Scrub through timeline
   - [ ] Click on waveform to jump
   - [ ] Playback position updates

### License Selection
1. Scroll to "License" section
2. **Available licenses display**
   - [ ] Basic License (e.g., $29)
   - [ ] Standard License (e.g., $99)
   - [ ] Premium/Exclusive (e.g., $499)

3. Select license
   - [ ] License highlight shows selection
   - [ ] Price updates

### Purchase Action
1. Click "Add to Cart" or "Buy Now"
2. **Verify success**
   - [ ] Cart count updates in header
   - [ ] Success toast/notification shows
   - [ ] Redirect to checkout (or stay on page)

### Producer Profile Link
1. Click producer name/avatar
2. **Verify producer storefront loads**
   - [ ] URL: `/marketplace/producers/[username]`
   - [ ] Producer info shows (bio, follower count)
   - [ ] Grid of their beats displays
   - [ ] "Follow" button visible

---

## Scenario 5: Shopping Cart & Checkout ✓

### Add Multiple Items
1. Add beats to cart from different producers
2. Add same beat with different licenses
3. **Verify cart updates**
   - [ ] Count in header shows total items
   - [ ] Cart drawer accuracy

### Review Cart
1. Click cart icon in header
2. **Cart drawer opens**
   - [ ] All items listed with prices
   - [ ] Remove item buttons work
   - [ ] Total calculated correctly
   - [ ] Subtotal, fees, tax shown

3. **Edit quantities**
   - [ ] Can increase/decrease quantities
   - [ ] Total recalculates

### Proceed to Checkout
1. Click "Proceed to Payment"
2. **Verify checkout page**
   - [ ] URL: `/checkout`
   - [ ] Order summary shows
   - [ ] Total matches cart
   - [ ] "Pay Now" button visible

3. Click "Pay Now"
   - [ ] Redirect to Stripe Checkout
   - [ ] Stripe-hosted page loads
   - [ ] Email prefilled (if logged in)

### Stripe Payment (Test Mode)
1. On Stripe checkout page
2. **Fill test payment info**
   - Card Number: 4242 4242 4242 4242
   - Exp: 12/34
   - CVC: 123

3. Enter test email: buyer1@test.com
4. Click "Pay"

5. **Verify payment succeeded**
   - [ ] Redirect to `/checkout/success`
   - [ ] Order confirmation displays
   - [ ] Download link provided
   - [ ] Email confirmation sent (check inbox)

### Failed Payment Recovery
1. Return to cart (if payment failed)
2. Try again with test card: 4000 0000 0000 0002 (decline)
3. **Verify error handling**
   - [ ] Error message displays
   - [ ] Return to checkout form
   - [ ] Cart preserved

---

## Scenario 6: Download & Library ✓

### Access Library
1. Log in as buyer (buyer1@test.com)
2. Navigate to: `/library`
3. **Verify library page loads**
   - [ ] "Purchased Beats" tab active
   - [ ] "Subscriptions" tab available

4. **View purchased beats**
   - [ ] Recently bought beats listed
   - [ ] Each shows: cover, title, producer, license type
   - [ ] Download buttons visible

### Download Beat
1. Click "Download" button for a beat
2. **Verify download started**
   - [ ] Browser initiates download
   - [ ] File format: MP3 or WAV (based on license)
   - [ ] File size reasonable (1-5MB typical)
   - [ ] Browser shows download progress

3. **Check file integrity**
   - [ ] File plays in local media player
   - [ ] Audio quality matches license

### Multiple Downloads
1. Download same beat multiple times
   - [ ] Each download works
   - [ ] No error on repeated download

2. Download different beats
   - [ ] All download successfully
   - [ ] Correct files downloaded

### Subscription Tab (if data exists)
1. Click "Subscriptions" tab
2. **View active subscriptions**
   - [ ] Subscription plan shows
   - [ ] Renewal date displays
   - [ ] Cancel button available (if applicable)

---

## Scenario 7: Producer Dashboard ✓

### Dashboard Access
1. Log in as producer (producer1@test.com)
2. Navigate to: `/dashboard`
3. **Verify dashboard loads**
   - [ ] Title: "Producer Dashboard"
   - [ ] Sidebar navigation visible
   - [ ] Overview page shows by default

### Stats Cards
1. **On overview page, check stat cards**
   - [ ] Total Beats: shows count
   - [ ] Total Sales: shows revenue
   - [ ] Total Plays: shows play count
   - [ ] Followers: shows follower count

2. Each card shows:
   - [ ] Value displayed prominently
   - [ ] Trend indicator (up/down arrow if available)
   - [ ] 30-day change percentage

### Recent Sales Table
1. On dashboard overview
2. **Check recent sales**
   - [ ] Table displays (even if empty)
   - [ ] Columns: Date, Beat, License, Price, Buyer

### Navigation Sidebar
1. Click each dashboard link
   - [ ] `/dashboard/beats` — Beat management
   - [ ] `/dashboard/analytics` — Charts/analytics
   - [ ] `/dashboard/earnings` — Revenue breakdown
   - [ ] `/dashboard/settings` — Profile settings

### Beats Management
1. Navigate to: `/dashboard/beats`
2. **Verify beats table**
   - [ ] Your uploaded beats listed
   - [ ] Columns: Title, Status, Plays, Sales, Price, Actions
   - [ ] Edit/Delete buttons work

3. Upload new beat (if upload feature present)
   - [ ] Click "Upload Beat" button
   - [ ] Multi-step upload wizard appears

### Analytics Page
1. Navigate to: `/dashboard/analytics`
2. **Verify charts load**
   - [ ] Chart placeholders present
   - [ ] X/Y axis labels visible
   - [ ] No console errors

### Earnings Page
1. Navigate to: `/dashboard/earnings`
2. **Verify earnings breakdown**
   - [ ] Revenue by license type shows
   - [ ] Total earnings displayed
   - [ ] Pending payout amount shown (if applicable)
   - [ ] Recent transaction list

### Settings Page
1. Navigate to: `/dashboard/settings`
2. **Update profile information**
   - [ ] Name field editable
   - [ ] Bio/description field works
   - [ ] Social links updateable
   - [ ] Save button functional

3. **Payment info section**
   - [ ] Stripe Connect status shown
   - [ ] Connect/Disconnect button works

---

## Scenario 8: Admin Panel ✓

### Admin Access
1. Log in with admin account (if available)
2. Navigate to: `/admin`
3. **Verify admin panel loads**
   - [ ] Title: "Admin Dashboard"
   - [ ] Admin-only sidebar visible
   - [ ] Overview page displays

### Admin Overview
1. **Stats on admin dashboard**
   - [ ] Total Users: count
   - [ ] Unverified Producers: count
   - [ ] Flagged Beats: count
   - [ ] Pending Payouts: count

2. **Recent Activity**
   - [ ] Activity log displays
   - [ ] Shows recent registrations, uploads, sales

### Producer Verification
1. Navigate to: `/admin/verification`
2. **Verification queue shows**
   - [ ] List of unverified producers
   - [ ] Each shows: name, email, genres, upload count

3. **Approve producer**
   - [ ] Click "Approve" button
   - [ ] Producer removed from queue
   - [ ] Producer now has access to payment features

4. **Reject producer**
   - [ ] Click "Reject" button
   - [ ] Reason field appears
   - [ ] Producer notified (if email configured)

### Beat Moderation
1. Navigate to: `/admin/beats`
2. **Flagged beats list**
   - [ ] Shows reported/flagged beats
   - [ ] Each beat shows: title, producer, reason, report count

3. **Review beat details**
   - [ ] Click beat to preview
   - [ ] Waveform player loads
   - [ ] Listen to audio

4. **Approve or remove beat**
   - [ ] "Approve" keeps beat live
   - [ ] "Remove" takes down beat
   - [ ] Producer notified

### User Management
1. Navigate to: `/admin/users`
2. **User table displays**
   - [ ] All users listed with: id, email, role, join date, status

3. **Block user**
   - [ ] Click "Block" button on user
   - [ ] User loses access
   - [ ] Can unblock later

---

## Scenario 9: Responsive Design ✓

### Desktop View (1920x1080)
Test all pages on desktop:
- [ ] Layout looks correct
- [ ] No horizontal scrolling
- [ ] Spacing/margins appropriate
- [ ] Text readable

### Tablet View (768x1024)
1. Open DevTools → Toggle Device Toolbar
2. Select iPad/Tablet preset
3. **Check responsive behavior**
   - [ ] Layout stacks appropriately
   - [ ] Sidebar becomes hamburger menu (if applicable)
   - [ ] Touch targets sized appropriately
   - [ ] No elements cut off

### Mobile View (375x667)
1. Set mobile viewport
2. **Test mobile UX**
   - [ ] Navigation collapses to mobile menu
   - [ ] Buttons/inputs easily tappable
   - [ ] No horizontal scrolling
   - [ ] Text readable without zoom

### Touch Interactions
1. On mobile device/emulated touch:
2. **Test touch interactions**
   - [ ] Buttons respond to tap
   - [ ] Forms work with mobile keyboard
   - [ ] Modals close/open on touch

---

## Scenario 10: Performance & Accessibility ✓

### Page Load Time
1. Open DevTools → Network tab
2. Load beatforge.pages.dev
3. **Verify performance**
   - [ ] Largest Contentful Paint: < 2.5s
   - [ ] First Input Delay: < 100ms
   - [ ] Total page size: < 5MB

### Lighthouse Score
```bash
npx lighthouse https://beatforge.pages.dev --view
```
- [ ] Performance: 60+
- [ ] Accessibility: 80+
- [ ] Best Practices: 80+
- [ ] SEO: 100

### Keyboard Navigation
1. Press Tab key repeatedly
2. **Verify keyboard accessibility**
   - [ ] Focus indicator visible
   - [ ] Can navigate through forms
   - [ ] Can submit forms with Enter key
   - [ ] Modal can close with Escape

### Screen Reader (optional)
1. Use browser screen reader
2. **Test accessibility**
   - [ ] Page structure makes sense
   - [ ] Images have alt text
   - [ ] Form labels associated
   - [ ] Buttons/links described clearly

---

## Scenario 11: Error Handling ✓

### Network Errors
1. Simulate poor connection (DevTools → Network → Throttle)
2. **Verify error states**
   - [ ] Loading indicators show
   - [ ] Timeout errors graceful
   - [ ] Retry buttons available

### 404 Pages
1. Navigate to: `/non-existent-page`
2. **Verify 404 page**
   - [ ] Custom 404 page displays
   - [ ] Links to home/marketplace
   - [ ] No console errors

### 500 Errors
1. Try invalid actions (if possible)
2. **Verify error handling**
   - [ ] Error boundary catches errors
   - [ ] User-friendly error message
   - [ ] Sentry captures error

### Form Validation
1. On any form page
2. **Test validation**
   - [ ] Required fields show error if empty
   - [ ] Email format validated
   - [ ] Password strength checked
   - [ ] Error messages clear

---

## Scenario 12: Data Persistence ✓

### Cart Persistence
1. Add items to cart
2. Close browser tab/window
3. Reopen site
4. **Verify cart persists**
   - [ ] Items still in cart
   - [ ] Quantities unchanged
   - [ ] Total correct

### Preference Storage
1. Change any user preference (theme, etc.)
2. Refresh page
3. **Verify preferences persist**
   - [ ] Settings maintained
   - [ ] Not using default

### Session Recovery
1. Start purchase flow
2. Close tab during checkout
3. Reopen site
4. **Verify recovery**
   - [ ] Can resume checkout
   - [ ] Cart items preserved

---

## Scenario 13: Security ✓

### HTTPS
1. Check URL bar
2. **Verify security**
   - [ ] Green lock icon shows
   - [ ] URL shows https://
   - [ ] Certificate valid

### CSP Headers (DevTools)
1. Open DevTools → Network → Any request
2. Check Response Headers
3. **Verify security headers**
   - [ ] Content-Security-Policy present
   - [ ] X-Frame-Options: DENY
   - [ ] X-Content-Type-Options: nosniff

### Password Security
1. On registration/login
2. **Verify password field**
   - [ ] Text masked (not visible)
   - [ ] "Show password" toggle (optional)

### CSRF Protection
1. Submit any form
2. **Verify CSRF token**
   - [ ] Request successful
   - [ ] No "Invalid token" errors

---

## Scenario 14: Notifications ✓

### Toast/Alert Notifications
1. Perform actions that trigger notifications:
   - [ ] Success message on login
   - [ ] Error on failed payment
   - [ ] Confirmation on beat upload
   - [ ] Warning on unsaved changes

2. **Verify notification UX**
   - [ ] Position consistent
   - [ ] Auto-disappear after 5s
   - [ ] Can manually close
   - [ ] Readable (good contrast)

### Notification Bell
1. If notifications feature present
2. Click bell icon in header
3. **Verify notification panel**
   - [ ] Unread count shows
   - [ ] Notification list displays
   - [ ] Can mark as read
   - [ ] Can delete notifications

---

## Checklist Summary

### Critical Path (Must Pass)
- [ ] User registration works
- [ ] Login/logout functional
- [ ] Marketplace browse works
- [ ] Cart add/remove works
- [ ] Payment completes
- [ ] Download starts
- [ ] Dashboard accessible
- [ ] No console errors

### Important Features (Should Pass)
- [ ] Audio player functional
- [ ] Search/filter works
- [ ] Responsive design
- [ ] Admin panel accessible
- [ ] Error pages display

### Nice-to-Have (Would Be Good)
- [ ] Keyboard navigation
- [ ] Analytics tracking
- [ ] Email confirmations
- [ ] Real-time notifications

---

## Test Results Template

```markdown
## Test Run Results

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: [Browser + OS]
**Base URL**: https://beatforge.pages.dev

### Scenario Results
| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Registration | ✓ | Passed |
| 2. Authentication | ✓ | Passed |
| ... | ... | ... |

### Issues Found
1. [Issue Title]
   - Severity: Critical/High/Medium/Low
   - Steps to Reproduce: ...
   - Expected: ...
   - Actual: ...

### Notes
- Performance acceptable
- No critical bugs
- Ready for production: YES/NO
```

---

**Last Updated**: April 12, 2026
**Status**: Ready for Testing 🧪
