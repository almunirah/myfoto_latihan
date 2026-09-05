# Change Management

## Branch policy
- `main` represents production-ready code.
- Structural/refactor work should be prepared on a separate branch and reviewed before merge.

## Safe refactor sequence
1. Document the current behavior.
2. Map dependencies.
3. Move one responsibility at a time.
4. Test user and admin flows.
5. Compare preview with production.
6. Merge only after regression checks pass.

## Protected production runtime for Phase 1
The following files must remain unchanged during Phase 1:
- `index.html`
- `app.js`
- `styles.css`
- `login-fix.js`
- `updates-v2.js`

## Rollback
If a later refactor introduces regression, revert the relevant commit or branch merge rather than patching production blindly.
