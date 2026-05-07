# Team Task Manager

A full-stack Team Task Manager application built with Next.js, Prisma, NextAuth, and SQLite. Features role-based access control (Admin/Member), project and task management, and a dynamic dashboard.

## � Project Contents

### 🏗️ **Core Application Structure**
```
team-task-manager/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── dashboard/     # Main dashboard with statistics
│   │   │   ├── tasks/         # Task management Kanban board
│   │   │   └── projects/      # Project management
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth authentication
│   │   │   ├── projects/      # Project CRUD operations
│   │   │   ├── tasks/         # Task CRUD operations
│   │   │   ├── users/         # User management
│   │   │   └── register/      # User registration
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable React components
│   │   └── Providers.tsx      # NextAuth providers
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # NextAuth configuration
│   │   └── prisma.ts          # Prisma client
│   ├── middleware.ts          # Auth middleware
│   ├── types/                 # TypeScript type definitions
│   │   └── next-auth.d.ts     # NextAuth types
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── dev.db                 # SQLite database
├── public/                    # Static assets
├── .env                       # Environment variables (excluded)
├── .gitignore                 # Git ignore file
├── package.json               # Dependencies and scripts
├── next.config.ts             # Next.js configuration
└── README.md                  # This file
```

### 🎯 **Key Features & Components**

#### **🔐 Authentication System**
- **Email/Password Login**: Traditional authentication
- **Google OAuth**: Social login integration
- **Role-based Access**: Admin vs Member permissions
- **Session Management**: Secure user sessions

#### **👥 User Management**
- **Admin Role**: Full system access, create projects/tasks
- **Member Role**: View assigned tasks, update status only
- **User Registration**: New user signup with role assignment
- **Profile Management**: User information and settings

#### **🏗️ Project Management**
- **Project Creation**: Admin can create new projects
- **Project Deadlines**: Set and track project completion dates
- **Project Statistics**: Task counts and progress tracking
- **Overdue Detection**: Automatic overdue project warnings

#### **📋 Task Management**
- **Task Creation**: Admin creates tasks with assignments
- **Task Assignment**: Assign tasks to specific team members
- **Status Tracking**: TODO → IN_PROGRESS → DONE workflow
- **Kanban Board**: Visual task organization by status
- **Member Updates**: Members can mark tasks as done

#### **📊 Dashboard & Analytics**
- **Admin Dashboard**: Complete system overview
- **Member Dashboard**: Personal task statistics
- **Real-time Updates**: Live task status changes
- **Progress Tracking**: Project completion percentages
- **Overdue Alerts**: Task and project deadline warnings

#### **🎨 User Interface**
- **Responsive Design**: Works on all device sizes
- **Dark Theme**: Modern dark color scheme
- **Glass Morphism**: Modern UI design elements
- **Interactive Components**: Smooth animations and transitions

## �🚀 Features
- **Authentication**: Email/Password and Google OAuth
- **Roles**: Admin (Create projects/tasks) and Member (View assigned projects, update task status)
- **Dashboard**: Track To Do, In Progress, and Completed tasks
- **Project & Task Management**: Kanban-style status tracking
- **Real-time Updates**: Live task status synchronization
- **Deadline Tracking**: Project and task deadline management
- **Team Collaboration**: Role-based task assignment and updates

## ⚙️ Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key"

   # For Local PostgreSQL
   DATABASE_URL="postgresql://user:password@localhost:5432/team-tasker"

   # For Google Auth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

3. **Database Setup**
   Ensure you have a PostgreSQL database running, then apply the schema:
   ```bash
   npx prisma db push
   ```

4. **Run the App**
   ```bash
   npm run dev
   ```

> **Note on First User**: The first user to register is automatically granted the `ADMIN` role. Subsequent users will be `MEMBER`s.


