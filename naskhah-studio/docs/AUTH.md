# Authentication and Authorization

## Current direction
Naskhah Studio uses controlled accounts rather than public self-registration.

## Roles
- `user` — access own writing projects and manuscript data
- `admin` — administrative functions only as authorized by backend policy

## Security requirements
- Authentication must be validated by backend/Supabase services.
- Admin role checks must not rely only on frontend JavaScript.
- Never hardcode production passwords in repository files.
- Session expiry, sign-out and authorization failures must fail safely.
- User content access must be enforced using backend authorization/RLS.

## Phase 1
No authentication code is changed in this phase.
