# Naskhah Studio — Master Application Prompt

Build a production-ready SaaS web application named **Naskhah Studio** with the tagline **“From Idea to Publication.”**

Naskhah Studio is a structured writing and publication workspace for researchers, academics, educators, lecturers, postgraduate students, authors and independent writers. It must help users manage the full writing journey rather than only type documents.

## Product Scope
Support four project types:
1. Journal Article
2. Thesis
3. Book
4. eBook

Each project must use the same core workspace tabs:
- Overview
- Writing Zone
- Outline Manager
- Checklist
- Research Notes
- References
- Versions / Save Manuscript
- Export

## Authentication & Access
Do not provide public registration. Accounts are created by Admin after purchase/activation. Provide two visible entry options only: **User Sign In** and **Admin**. Users may sign in using either email or username plus password. Include Forgot Password using recovery email. Do not include Google Sign In.

Users may update display name, email and password in Profile. Admin may create accounts, edit account details, manage plan/subscription, suspend/activate users and permanently delete inactive users with confirmation. Admin must never see manuscript content; Admin may only see project metadata such as project title, type, creation date and status.

## Journal Article Template
Use this section order:
1. Abstract
2. Keywords
3. Introduction
4. Literature Review
5. Methodology
6. Results and Discussion
7. Conclusion
8. Acknowledgement
9. References

Default word target is 10,000 and must be editable.

Add article-specific tracking:
- deadline for every section
- reminder 1–30 days before each due date
- supervisor submission date
- supervisor reminder
- feedback date
- supervisor status
- journal profile
- journal publisher/URL
- journal submission date
- journal reminder
- article status: Draft, Supervisor Review, Ready for Submission, Submitted, Under Review, Minor Revision, Major Revision, Accepted, Published, Rejected
- revision tracker

## Thesis Template
Use this chapter order:
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

Default word target is 70,000 and must be editable.

Add thesis-specific tracking:
- deadline for every chapter/section
- reminder 1–30 days
- supervisor submission date
- supervisor status
- final thesis submission date
- final submission reminder
- final thesis status

## Book Template
Default target: 50,000 words.
Workflow phases:
1. Preparation
2. Book Outline
3. Schedule
4. Writing
5. Editing
6. Feedback
7. Final

Allow adding custom chapters and outline notes.

## eBook Template
Default target: 15,000 words.
Workflow phases:
1. Idea & Audience
2. Outline
3. Content Plan
4. Writing
5. Editing
6. Design & Review
7. Publishing

## Overview
Show four professional pastel metric cards:
- Total Words: blue
- Progress %: purple
- Total Sections: green
- Deadline Date: orange

Also show Writing Health and editable daily/weekly writing goals.

## Writing Zone
Create a comfortable long-form editor with:
- section navigation
- live word count for active section
- total manuscript word count
- estimated reading time
- autosave
- prominent manual **SIMPAN / SAVE** button on every writing section
- Undo and Redo
- Focus Writing mode
- Hide/Show formatting toolbar
- fonts: Times New Roman, Arial, Calibri, Georgia, Garamond
- font size
- line spacing: 1.0, 1.15, 1.5, 2.0
- Bold, Italic, Underline
- Left, Center, Right, Justify
- insert editable table
- upload image, graph or figure
- figure caption

The user must have confidence that pressing Save truly persists the current section to the database.

## Outline Manager
Allow adding chapters/sections. Each outline item contains:
- title
- outline notes
- target words
- status: Not Started, Drafting, Review, Complete
- delete

## Checklist
Checklist content changes according to project type and writing phase. Display phase progress percentage and allow users to add custom checklist items.

## Deadline Management
Every section/chapter can have:
- due date
- reminder selector from 1 to 30 days
- word target

Use compact input fields; do not make date/reminder boxes excessively wide. Dashboard should surface approaching deadlines.

## Research Notes
Each note must contain:
- title
- note content
- Save
- Delete

## References
Provide a project-level reference workspace. Each reference contains:
- author/title field
- style selector: APA 7, Harvard, MLA, Chicago, IEEE
- formatted reference, DOI or URL
- Copy Citation
- Save
- Delete

## Versions
Call this feature **Simpan Manuskrip**, never “Save Snapshot.”
Allow users to:
- save a named manuscript version
- list saved versions with timestamp
- open a saved version
- restore a saved version
- delete a saved version

## Export
Support:
- Word / DOCX download
- TXT
- Print / Save PDF
- Share / Save to Cloud using Web Share API when available

## Profile
Display and allow appropriate updates for:
- display name
- username
- email
- registration date
- current plan
- subscription status
- subscription expiry
- account status
- password change

## Admin Panel
Dashboard cards:
- Registered Users
- Active Users
- Projects
- Paid Plans

User Management table:
- name
- username
- email
- registered date
- plan
- subscription status
- subscription expiry
- account status
- actions

Admin can add a user with temporary password, plan, subscription status and expiry date. Admin can edit details. Delete must be restricted to non-admin inactive/suspended users and require confirmation.

Admin project view must show metadata only and must never select or render manuscript content.

## Branding & UI
Brand: **Naskhah Studio**
Tagline: **From Idea to Publication**
Use the approved simple professional book-themed logo: open book + letter N, deep navy with muted gold. Display the logo and brand prominently on login and in the application sidebar.

Login UI must contain no marketing sentence saying accounts are supplied after purchase. It must only show User Sign In, Forgot Password and Admin access.

Use a clean modern professional SaaS interface suitable for academic and professional writers. Avoid childish visuals.

## Responsive Design
Must work well on:
- desktop/PC
- laptop
- tablet/iPad
- Android
- iPhone/mobile

On mobile:
- navigation becomes a drawer
- writing section list becomes horizontally scrollable
- tabs may scroll horizontally
- editor gets priority screen space
- tables and deadline grids use controlled horizontal scrolling
- do not allow the page layout to break

## Backend
Use the existing Supabase project and existing Naskhah database schema/authentication. Maintain data isolation with RLS. Use the existing stable username/email login Edge Function. Keep admin-created account workflow.

## Performance Rules
Do not recreate the old patch architecture containing app1.js, app2.js ... app35.js. Consolidate application logic.

Preferred production files:
- index.html
- styles.css
- app.js
- login-fix.js only if required for stable authentication
- assets/logo.svg
- docs/

Do not use global MutationObservers for normal UI state. Do not repeatedly patch rendered DOM. Use explicit render functions and direct event binding. Internal application JS and CSS must deploy with the application rather than loading dozens of internal scripts through jsDelivr.

The final product should feel like a focused alternative to general writing tools: it combines manuscript writing, structured workflow, academic/article/thesis tracking, deadlines, references, versions and submission management in one application.