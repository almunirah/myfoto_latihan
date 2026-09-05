# Backend Services

The current Naskhah Studio frontend calls Supabase services directly and also calls Supabase Edge Function endpoints.

## Verified frontend references
- Supabase project URL is configured in `app.js`.
- General auth/admin route: `/functions/v1/naskhah-v1-auth`
- Login route: `/functions/v1/naskhah-login`

## Source-code status
The Edge Function source is not currently present in this frontend repository. Phase 1.5 therefore documents only the verified routes and does not invent backend implementation files.

## Future repository improvement
When the actual Supabase backend source is available, store verified Edge Function source under a dedicated backend/supabase structure or use the Supabase CLI project layout. Version database migrations and function code together only after confirming they match the live project.

## PHP
There is no PHP backend in the current application. Do not place PHP files here unless PHP is intentionally introduced as a future architecture change.
