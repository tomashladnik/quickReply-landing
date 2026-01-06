# Teacher Portal – Frontend Integration Notes

This document describes the frontend work completed for the Teacher Portal and how it integrates with the existing backend APIs.

## Overview

The Teacher Dashboard frontend has been implemented and integrated with backend APIs provided by the team. The dashboard allows authenticated teachers to:

- View their assigned classes
- View enrolled students per class
- See student consent status
- See scan completion status
- Export class participation data as CSV
- Log out securely

Authentication is handled using a JWT stored in localStorage (`teacher_token`) issued by the backend.

---

## Integrated Backend APIs

The frontend consumes the following backend endpoints:

- **POST `/api/teacher/auth/login`**
  - Used to authenticate teachers
  - Returns a JWT stored in localStorage

- **GET `/api/teacher/classes`**
  - Fetches all classes assigned to the authenticated teacher
  - Used to populate the “Your Classes” section

- **GET `/api/teacher/classes/[classId]/roster`**
  - Fetches student roster for a selected class
  - Displays:
    - Student name
    - Consent status
    - Scan completion status
  - No sensitive results or images are exposed

- **GET `/api/teacher/classes/[classId]/participation`**
  - Downloads a CSV file with:
    - Student name
    - Consent
    - Scan status

---

## Frontend Implementation Details

- **Dashboard Page**
  - Path: `src/app/school/teacher/dashboard/page.tsx`
  - Handles:
    - Token validation
    - Class selection
    - Roster loading
    - CSV export
    - Logout

- **Roster Mapping**
  - Backend returns students as:
    ```json
    {
      "id": "...",
      "name": "John Doe",
      "consent": true,
      "scanStatus": "completed"
    }
    ```
  - Frontend maps this into a `RosterRow` object:
    - `name`
    - `consent`
    - `scanDone`

- **Error Handling**
  - Displays:
    - “No classes found” if teacher has no assigned classes
    - “No students found” if a class has no enrollments
  - Guards against undefined or missing data to prevent runtime crashes

---

## Data & Auth Assumptions

- Teachers **do not sign up** via the UI
  - Teacher accounts are pre-created in the database (Prisma)
  - Teachers log in using provided credentials
- Student and enrollment data is assumed to exist in the database
- Frontend was tested using local Prisma data (`dev.db`)



