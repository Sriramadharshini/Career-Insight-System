# Career Insight System

This workspace now contains a starter full-stack career insight system:

- `frontend`: React + Vite application
- `backend`: Express + MongoDB API

## Flow

1. User registers or logs in
2. User lands on onboarding page
3. Fresher users choose `Create Profile`
4. Profile data is stored in MongoDB
5. A resume template is selected based on stored profile data
6. Users can view the generated resume page
7. Experienced users choose `Upload Resume`
8. Resume is analyzed and an ATS score is returned

## Run backend

Create `backend/.env` from `backend/.env.example`, then run:

```bash
cd backend
npm install
npm run dev
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

## Important note

The ATS upload in this starter version expects a text-based resume file such as `.txt`.
If you want PDF or DOCX parsing, that can be added next with a parser library.
