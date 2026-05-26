# 🎓 Student Awards Portal

This is a web app built for the **University of Guelph** that helps:
- 🧑‍🎓 **Students** view and apply for different awards.
- 🧑‍⚖️ **Committee Members** review applications and rank students.
- 🛠️ **Admins** manage awards, forms, and eligibility criteria.

## ✨ Features

- Browse and filter awards by criteria
- Each award has its own rules and application form
- Students can upload their resume (PDF)
- Committee members can view resumes directly (no downloads)
- Admin dashboard to update awards and forms
- Role-based access for students, committee, and admins

## 🧰 Tech Stack

| Area       | Tools Used                              |
|------------|------------------------------------------|
| Frontend   | Next.js, Tailwind CSS, ShadCN UI         |
| Backend    | Next.js API Routes, GraphQL              |
| Database   | Supabase                                 |
| Auth       | Supabase Auth                            |
| Storage    | Supabase Storage                         |
| Resume Viewer | `react-pdf`, `pdf.js`                 |

## 🚀 Getting Started

To run the project locally:

```bash
# 1. Clone the repo
git clone https://github.com/your-username/student-awards-portal.git

# 2. Go into the frontend app
cd student-awards-portal/frontend

# 3. Create .env with your Supabase URL and anon key (see Supabase project settings)

# 4. Install dependencies and start the dev server
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase setup (local / dev database)

Run these SQL scripts in the Supabase SQL Editor, in order:

1. `frontend/scripts/supabase.sql` — schema  
2. `frontend/scripts/mock-seed.sql` — test auth users (login only; no sample awards or applications)  
3. `frontend/scripts/supabase-rls.sql` — row-level security (required for the app to load data)  
4. `frontend/scripts/supabase-storage.sql` — file upload buckets and policies  

Create awards and `profiles` rows via the app or Supabase dashboard after seeding auth users.

## 🔐 Test login details

After running `mock-seed.sql`, you can sign in with these accounts. **Password for all accounts:** `TestPassword123!`

| Intended role | Email |
|---------------|--------|
| Admin | `admin@uoguelph.ca` |
| Reviewer | `reviewer@uoguelph.ca` |
| Student | `student1@uoguelph.ca` |
| Student | `student2@uoguelph.ca` |

Each user needs a matching row in `public.profiles` (with `user_type`) for role-based features. Add those manually or through your signup flow.
