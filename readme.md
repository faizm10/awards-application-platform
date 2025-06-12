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

# 2. Go into the project folder
cd student-awards-portal

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
