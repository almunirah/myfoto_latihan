# Deployment

## Production
- Hosting: Vercel
- Production application folder: `naskhah-studio/`
- Custom domain: `www.naskhahstudio.com`
- Apex domain: `naskhahstudio.com` redirects to `www.naskhahstudio.com`

## Deployment safety
- Do not deploy the legacy `naskhah-writing-studio-v1/` folder.
- Production changes should be tested on a separate branch/preview before merging to `main`.
- Do not commit secrets.
- Verify login, project creation, manuscript save, versions, export, admin access and logout after production deployment.

## Phase 1
Repository structure/documentation only. Existing production runtime is intentionally unchanged.
