# Parent Portal - Complete File Structure

This document contains all files and locations related to the Parent Portal implementation.

## 📁 Frontend Pages (React Components)

### Main Portal Entry
- **`src/app/school/page.tsx`** - School portal entry page (role selection)

### Parent Portal Pages
- **`src/app/school/parent/page.tsx`** - Parent login/OTP flow page
- **`src/app/school/parent/enroll/page.tsx`** - Child enrollment form with school code
- **`src/app/school/parent/dashboard/page.tsx`** - Parent dashboard with children overview
- **`src/app/school/parent/settings/page.tsx`** - Account settings and consent management

### Child Detail Pages
- **`src/app/school/parent/child/[id]/page.tsx`** - Child scan result details page
- **`src/app/school/parent/child/[id]/history/page.tsx`** - Scan history timeline page
- **`src/app/school/parent/child/[id]/dentist/page.tsx`** - Dentist sharing management page

## 🔌 Backend API Routes

### Authentication APIs
- **`src/app/api/school/parent/send-otp/route.ts`** - Send OTP to parent (email or phone)
- **`src/app/api/school/parent/verify-otp/route.ts`** - Verify OTP and generate JWT token

### Enrollment APIs
- **`src/app/api/school/verify-code/route.ts`** - Verify school enrollment code
- **`src/app/api/school/parent/enroll/route.ts`** - Parent and child enrollment with consent

### Dashboard & Child Management APIs
- **`src/app/api/school/parent/children/route.ts`** - Get all children for a parent
- **`src/app/api/school/parent/child/[id]/route.ts`** - Get child details and latest scan
- **`src/app/api/school/parent/child/[id]/history/route.ts`** - Get scan history for a child

### Dentist Sharing APIs
- **`src/app/api/school/parent/child/[id]/dentist/route.ts`** - Get dentist sharing status
- **`src/app/api/school/parent/child/[id]/dentist/share/route.ts`** - Share child's reports with dentist
- **`src/app/api/school/parent/child/[id]/dentist/revoke/route.ts`** - Revoke dentist access

### Settings & Consent APIs
- **`src/app/api/school/parent/settings/route.ts`** - Get parent settings and consent status
- **`src/app/api/school/parent/child/[id]/revoke-consent/route.ts`** - Revoke consent and delete child data

## 🛠️ Utility Files

### Authentication Utilities
- **`src/lib/school/auth.ts`** - JWT token verification and generation utilities

## 🗄️ Database Schema

### Prisma Schema
- **`prisma/schema.prisma`** - Database schema (includes School, Parent, Child, SchoolScan, DentistShare, AuditLog models)

## 📜 Scripts

### Test Data Scripts
- **`scripts/create-test-data.ts`** - TypeScript script to create test schools and codes
- **`scripts/create-test-data.sql`** - SQL script to create test data

## 📊 File Count Summary

- **Frontend Pages:** 7 files
- **Backend API Routes:** 12 files
- **Utility Files:** 1 file
- **Database Schema:** 1 file
- **Scripts:** 2 files

**Total: 23 files**

## 🔗 File Structure Tree

```
src/
├── app/
│   ├── school/
│   │   ├── page.tsx                                    # Portal entry
│   │   └── parent/
│   │       ├── page.tsx                                # Login/OTP
│   │       ├── enroll/
│   │       │   └── page.tsx                            # Enrollment
│   │       ├── dashboard/
│   │       │   └── page.tsx                            # Dashboard
│   │       ├── settings/
│   │       │   └── page.tsx                            # Settings
│   │       └── child/
│   │           └── [id]/
│   │               ├── page.tsx                        # Child details
│   │               ├── history/
│   │               │   └── page.tsx                    # Scan history
│   │               └── dentist/
│   │                   └── page.tsx                    # Dentist sharing
│   └── api/
│       └── school/
│           ├── verify-code/
│           │   └── route.ts                            # Verify school code
│           └── parent/
│               ├── send-otp/
│               │   └── route.ts                        # Send OTP
│               ├── verify-otp/
│               │   └── route.ts                        # Verify OTP
│               ├── enroll/
│               │   └── route.ts                        # Enrollment
│               ├── children/
│               │   └── route.ts                        # List children
│               ├── settings/
│               │   └── route.ts                        # Settings
│               └── child/
│                   └── [id]/
│                       ├── route.ts                    # Child details
│                       ├── history/
│                       │   └── route.ts                # Scan history
│                       ├── revoke-consent/
│                       │   └── route.ts                # Revoke consent
│                       └── dentist/
│                           ├── route.ts                # Dentist status
│                           ├── share/
│                           │   └── route.ts            # Share with dentist
│                           └── revoke/
│                               └── route.ts            # Revoke access
├── lib/
│   └── school/
│       └── auth.ts                                      # Auth utilities
prisma/
└── schema.prisma                                        # Database schema
scripts/
├── create-test-data.ts                                  # Test data script
└── create-test-data.sql                                 # Test data SQL
```

## 🎯 Key Features by File

### Authentication Flow
- Login: `src/app/school/parent/page.tsx`
- Send OTP: `src/app/api/school/parent/send-otp/route.ts`
- Verify OTP: `src/app/api/school/parent/verify-otp/route.ts`
- Auth Utils: `src/lib/school/auth.ts`

### Enrollment Flow
- Enrollment Form: `src/app/school/parent/enroll/page.tsx`
- Verify Code: `src/app/api/school/verify-code/route.ts`
- Enroll API: `src/app/api/school/parent/enroll/route.ts`

### Dashboard & Navigation
- Dashboard: `src/app/school/parent/dashboard/page.tsx`
- Children List: `src/app/api/school/parent/children/route.ts`

### Child Details & History
- Child Details: `src/app/school/parent/child/[id]/page.tsx`
- Child API: `src/app/api/school/parent/child/[id]/route.ts`
- History Page: `src/app/school/parent/child/[id]/history/page.tsx`
- History API: `src/app/api/school/parent/child/[id]/history/route.ts`

### Dentist Sharing
- Dentist Page: `src/app/school/parent/child/[id]/dentist/page.tsx`
- Dentist Status: `src/app/api/school/parent/child/[id]/dentist/route.ts`
- Share API: `src/app/api/school/parent/child/[id]/dentist/share/route.ts`
- Revoke API: `src/app/api/school/parent/child/[id]/dentist/revoke/route.ts`

### Settings & Consent
- Settings Page: `src/app/school/parent/settings/page.tsx`
- Settings API: `src/app/api/school/parent/settings/route.ts`
- Revoke Consent: `src/app/api/school/parent/child/[id]/revoke-consent/route.ts`

## 📝 Notes

- All frontend pages use Next.js App Router (`app/` directory)
- All API routes are Next.js API Routes (`route.ts` files)
- Dynamic routes use `[id]` for child IDs
- Authentication uses JWT tokens stored in localStorage
- Database models are defined in Prisma schema
- Test data can be created using the scripts in `scripts/` directory

## 🚀 Quick Access

**To test enrollment:**
- Use school codes: `PS123-DSCAN` or `WESTVIEW-SCAN`
- Enrollment page: `http://localhost:3000/school/parent/enroll`

**To test login:**
- Login page: `http://localhost:3000/school/parent`
- Supports both email and phone number login

**To view dashboard:**
- Dashboard: `http://localhost:3000/school/parent/dashboard`

