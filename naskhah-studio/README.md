# Naskhah Studio

**From Idea to Publication**

This folder is the canonical production source for Naskhah Studio.

## Production Structure
- `index.html` — application shell
- `styles.css` — responsive UI
- `app.js` — consolidated application logic
- `login-fix.js` — stable email/username login bridge
- `assets/logo.svg` — approved Naskhah Studio logo
- `docs/FINAL_FRAMEWORK.md` — agreed final product framework
- `docs/MASTER_PROMPT.md` — complete rebuild prompt/specification

## Deployment Rule
Deploy only from this folder. Do not deploy the legacy `naskhah-writing-studio-v1` patch chain.

## Product Access
- User Sign In: email or username + password
- Admin Sign In
- No public registration
- No Google Sign In

## Backend
Supabase project: existing Naskhah backend and RLS policies.

## Legacy
Older folders in the repository are retained only as historical references and must not be used for production deployment.