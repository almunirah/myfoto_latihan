# Security Baseline

## Principles
- Never commit passwords, service-role keys, private tokens, or secrets.
- Keep privileged operations on trusted backend services.
- Enforce authorization and row-level security for user-owned data.
- Keep manuscript media private unless explicitly shared.
- Validate and sanitize user-controlled input before storage or rendering.
- Maintain least-privilege admin access.

## Production checks
- Authentication works only for valid accounts.
- Normal users cannot invoke admin operations.
- Admin users cannot access manuscript content unless product policy explicitly allows it.
- Storage policies prevent cross-user access.
- Production domain uses HTTPS.

Phase 1 makes no security-sensitive runtime changes.
