# Naskhah Writing Studio V1

Aplikasi penulisan berstruktur untuk Journal Article, Book dan eBook.

## Production

https://naskhah-writing-studio-v1-ezytech1.vercel.app

## Admin test

- Username: `admin`
- Password: `admin123`

## User flow

1. Register menggunakan nama, username dan password.
2. Email recovery adalah optional tetapi diperlukan jika mahu guna Forgot Password.
3. Login menggunakan username + password.
4. Cipta projek Article / Book / eBook.
5. Gunakan Writing Zone, Outline Manager, Checklist 7 Fasa, Research Notes, References, Version History dan Export.

## Backend

Supabase V1 schema menggunakan table `nv1_profiles` dan `nv1_projects`, dengan auth melalui Edge Function `naskhah-v1-auth` dan Row Level Security untuk pemilikan projek.
