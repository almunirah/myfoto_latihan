# Naskhah Studio — Final Framework

**Brand:** Naskhah Studio  
**Tagline:** From Idea to Publication

## 1. Product Positioning
Naskhah Studio ialah structured writing workspace untuk researcher, academic, educator, lecturer, postgraduate student, author dan independent writer. Fokus utama bukan sekadar menaip dokumen, tetapi mengurus keseluruhan perjalanan penulisan daripada idea, rangka, draf, semakan, deadline, supervisor/reviewer, revision hingga submission/publishing.

## 2. User Access Model
- Tiada public self-registration.
- Akaun user dicipta oleh Admin selepas pembelian/activation.
- User Sign In menggunakan email atau username + password.
- Admin Sign In berasingan pada UI tetapi menggunakan sistem authentication yang sama.
- Forgot Password menggunakan recovery email.
- User boleh kemas kini nama, email dan password dalam Profile.
- Admin boleh create, edit, suspend/activate dan delete user yang tidak aktif.
- Admin hanya boleh melihat metadata projek (nama projek, jenis projek, tarikh, status), bukan kandungan manuskrip user.

## 3. Project Types
1. Artikel Jurnal
2. Tesis
3. Buku
4. eBook

## 4. Standard Workspace Tabs
Setiap projek mempunyai:
- Overview
- Zon Menulis
- Pengurus Rangka
- Senarai Semak
- Research Notes
- References
- Versions / Simpan Manuskrip
- Export

## 5. Artikel Jurnal Structure
Susunan standard:
1. Abstract
2. Keywords
3. Introduction
4. Literature Review
5. Methodology
6. Results and Discussion
7. Conclusion
8. Acknowledgement
9. References

Default word target: 10,000 perkataan, tetapi user boleh ubah.

Tambahan khusus Artikel:
- Section deadline + reminder 1–30 hari
- Submission kepada Supervisor
- Tarikh feedback
- Status supervisor
- Journal Profile
- Tarikh submission ke jurnal + reminder
- Status artikel
- Revision Tracker

## 6. Tesis Structure
Susunan standard:
1. Abstract
2. Acknowledgement
3. Chapter 1: Introduction
4. Chapter 2: Literature Review
5. Chapter 3: Methodology
6. Chapter 4: Results / Findings
7. Chapter 5: Discussion
8. Chapter 6: Conclusion & Recommendations
9. References
10. Appendices

Default word target: 70,000 perkataan, tetapi user boleh ubah.

Tambahan khusus Tesis:
- Chapter deadline + reminder 1–30 hari
- Submission chapter kepada Supervisor
- Supervisor review status
- Final thesis submission date
- Final submission reminder
- Final status

## 7. Buku Workflow
Fasa:
1. Persediaan
2. Rangka Buku
3. Jadual
4. Menulis
5. Suntingan
6. Maklum Balas
7. Akhir

Default word target: 50,000.

## 8. eBook Workflow
Fasa:
1. Idea & Audience
2. Outline
3. Content Plan
4. Writing
5. Editing
6. Design & Review
7. Publishing

Default word target: 15,000.

## 9. Writing Zone
Editor mesti menyediakan:
- Word count setiap section
- Total project word count
- Reading time
- Autosave
- Manual SIMPAN / SAVE setiap section
- Undo / Redo
- Focus Writing
- Collapse/Hide toolbar
- Font pilihan: Times New Roman, Arial, Calibri, Georgia, Garamond
- Font size
- Line spacing 1.0, 1.15, 1.5, 2.0
- Bold, Italic, Underline
- Left, Center, Right, Justify
- Insert Table
- Upload Image / Figure / Graph
- Caption

## 10. Overview UI
4 kad utama berwarna:
- Jumlah Perkataan — biru
- % Kemajuan — ungu
- Jumlah Bahagian — hijau
- Tarikh Deadline — oren

Overview turut mengandungi Writing Health, writing goals dan deadline management.

## 11. Deadline & Reminder Rules
- Setiap section/chapter boleh mempunyai due date sendiri.
- Reminder boleh dipilih 1 hingga 30 hari sebelum due date.
- Project-level deadline juga tersedia.
- Dashboard memaparkan deadline yang akan tiba.
- Semua field deadline mesti compact dan tidak terlalu panjang.

## 12. Research Notes
Setiap note mempunyai:
- Tajuk
- Kandungan notes
- Save
- Delete

## 13. References
Setiap reference mempunyai:
- Tajuk/Author
- Citation style: APA 7, Harvard, MLA, Chicago, IEEE
- Formatted reference / DOI / URL
- Copy Citation
- Save
- Delete

## 14. Versions
Nama UI: **Simpan Manuskrip**, bukan Simpan Snapshot.
- User boleh beri nama versi.
- User boleh buka semula versi lama.
- User boleh restore version.
- User boleh delete version.

## 15. Export
- Word / DOCX
- TXT
- Print / Save PDF
- Share / Save to Cloud melalui device share sheet jika disokong

## 16. Profile & Subscription
User profile:
- Nama
- Username
- Email
- Tarikh mula daftar
- Plan
- Subscription status
- Subscription expiry
- Account status
- Change Password

## 17. Admin Panel
Admin boleh melihat:
- Registered Users
- Active Users
- Project count
- Paid plans
- Username
- Email
- Registered date
- Plan
- Subscription status
- Expiry
- Account status
- Project title/type/created/status metadata sahaja

Admin tidak boleh membaca manuscript content user.

## 18. Responsive Requirements
Aplikasi mesti responsive untuk:
- Desktop / PC
- Laptop
- Tablet / iPad
- Android phone
- iPhone / mobile phone

Mobile:
- Sidebar menjadi drawer
- Tabs horizontal scroll
- Editor kekal usable
- Tables/deadline rows scroll secara terkawal

## 19. Branding
- Logo tema buku terbuka + monogram N
- Navy + muted gold
- Nama: Naskhah Studio
- Tagline: From Idea to Publication
- Login UI hanya User Sign In dan Admin
- Tiada Google Sign In
- Tiada public Register

## 20. Performance Baseline
Production source tidak boleh menggunakan puluhan patch appXX.js lagi.
Gunakan source consolidated:
- index.html
- styles.css
- app.js
- login-fix.js
- logo.svg

Elakkan MutationObserver global yang berulang dan elakkan CDN chain untuk internal application modules.
