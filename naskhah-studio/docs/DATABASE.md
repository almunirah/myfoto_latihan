# Database

Naskhah Studio uses Supabase for application data and authentication-related backend services.

## Known application tables
- `nv1_profiles`
- `nv1_projects`
- `nv1_project_metadata`

## Storage
- Private bucket: `naskhah-media`

## Rules
- Do not store service-role or other privileged secrets in frontend files.
- User manuscript content must remain protected by row-level security and authorization checks.
- Admin functions should expose metadata required for administration, not manuscript content.

Detailed schema changes should be documented here before production rollout.
