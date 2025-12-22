# Teacher Backend Notes

Backend scope for the teacher portal is implemented with Next.js route handlers and Prisma models.

Completed endpoints
- POST /api/teacher/auth/login (school login via email/password; returns JWT)
- GET /api/teacher/classes (list classes for authenticated teacher)
- GET /api/teacher/classes/[classId]/roster (student roster with consent + scan status only)
- GET /api/teacher/classes/[classId]/participation (CSV export: name, consent, scan status only)

Auth helper
- src/lib/teacher-auth.ts provides password hashing/verify and JWT issuing/verification.

Data models added
- School, Teacher, SchoolClass, Student, ClassEnrollment in prisma/schema.prisma

Compliance note
- Participation export and roster do not include results or images.
