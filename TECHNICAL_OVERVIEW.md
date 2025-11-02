# Project Overview - Awards Application Platform

## System Description

The Awards Application Platform is a web-based application that allows students to browse and apply for awards, enables committee members to review applications, and provides administrators with tools to manage awards and eligibility criteria. The system is built as a modern, responsive website that works in any web browser. It uses a cloud-based database and authentication system to securely store user information, application data, and uploaded documents (like PDF resumes). The platform includes three different user interfaces depending on the person's role—students can submit applications and track their status, reviewers can access and evaluate applications, and administrators can create and manage awards. The application follows current web development best practices and is designed to be easily maintained and extended over time.

## Ideal Candidate Profile

The ideal person to take over this project should have experience building modern, interactive websites with the following skills:

- **Web Development Experience**: Experience creating websites that are interactive and responsive (work well on computers, tablets, and phones)
- **JavaScript/TypeScript**: Strong programming skills in modern web development languages
- **React Framework**: Experience with React, which is a popular tool for building interactive user interfaces
- **Full-Stack Development**: Ability to work on both the user-facing part of the website (what users see and interact with) and the behind-the-scenes functionality (database, authentication, file handling)
- **Database Management**: Experience working with databases to store and retrieve information
- **User Authentication**: Understanding of how to implement secure user logins and manage different user roles
- **Cloud Services**: Familiarity with cloud-based hosting and database services (the project uses Supabase, which is a cloud platform that provides databases, authentication, and file storage)
- **Version Control**: Comfortable using Git for code management and collaboration
- **Problem Solving**: Ability to debug issues, implement new features, and maintain code quality

The project uses modern development tools and frameworks that are widely used in the web development community, so someone with general full-stack web development experience should be able to pick it up with some onboarding.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── admin-dashboard/   # Admin interface
│   ├── reviewer-dashboard/# Reviewer interface
│   ├── my-applications/   # Student applications
│   ├── awards/            # Award listings
│   └── auth/              # Authentication pages
├── components/            # React components
│   └── ui/               # ShadCN UI components
├── lib/                  # Business logic & API calls
├── hooks/                # Custom React hooks
├── contexts/             # React contexts (AuthContext)
└── supabase/             # Supabase client configuration
```

## Key Features

- Role-based authentication (Student, Reviewer, Admin)
- Award browsing and application submission
- PDF resume upload and viewing
- Admin dashboard for award management
- Reviewer dashboard for application review
- Protected routes with middleware-based session management

