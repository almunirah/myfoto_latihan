# SQL / Database Change Policy

Naskhah Studio currently uses Supabase PostgreSQL.

## Important
- Database SQL must use PostgreSQL/Supabase-compatible syntax.
- Do not use MySQL-specific SQL unless the database platform is deliberately changed.
- Do not create Laravel/PHP migrations for the current architecture.
- Never expose service-role keys or privileged credentials in frontend code or committed SQL files.
- Review Row Level Security (RLS) and authorization impact for every schema/policy change.

## Verified application data references
The current application/documentation references:
- `nv1_profiles`
- `nv1_projects`
- `nv1_project_metadata`
- private storage bucket `naskhah-media`

## Migration rule
No executable schema migration is added in Phase 1.5 because the full live Supabase schema has not yet been exported and verified in this repository.

Before adding SQL migrations:
1. Export or inspect the actual live Supabase schema.
2. Verify table columns, constraints, indexes, RLS policies, functions and storage policies.
3. Store changes as ordered PostgreSQL migration files.
4. Test on a non-production environment first.
5. Document rollback or forward-fix steps.

This prevents documentation from inventing database structures that may not match production.
