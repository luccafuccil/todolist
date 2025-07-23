# To-do List with tRPC & Next.js

A complete task management system built in two days as part of a technical challenge.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

- **Create and edit tasks** with title and optional description
- **List all tasks** in an organized way (newest first)
- **Mark as completed** with a simple checkbox click
- **Safe deletion** of individual tasks or of completed ones in bulk
- **Responsive design** optimized for desktop and mobile
- **Automatic infinite scroll** pagination
- **See timestamps** for when each task was created and last edited
- **Smart sorting** with to-do tasks first and completed tasks last

## Tech Stack

- **Next.js 15** - React framework with SSR
- **tRPC**
- **TypeScript**
- **Tailwind CSS** - For straightforward, easy to maintain CSS
- **Zod** - For validation

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/luccafuccil/todolist.git

# Navigate to the project directory
cd todolist

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture Overview

### Backend (tRPC)
The entire backend lives in memory (yes, when you restart the server, everything disappears - it was a challenge requirement). The structure is pretty straightforward:

```typescript
// Each task looks like this:
type Todo = {
  id: number;           // Unique auto-generated ID (creation order based)
  name: string;         // Task title (required)
  description?: string; // Optional description
  completed: boolean;   // Whether it's marked as done
  createdAt: Date;      // When it was created
  updatedAt?: Date;     // When it was last edited
}
```

### Frontend
- **Home page (`/`)**: Lists all tasks using SSR
- **Create task (`/add-new`)**: Form to add new tasks
- **Edit task (`/edit?id=X`)**: Form to edit existing tasks

### Special Features

**Server-Side Rendering (SSR)**  
Initial task list is pre-rendered on the server for instant loading and better SEO.

**Infinite Pagination**  
Tasks load in batches of 5 using cursor-based pagination. Scroll to automatically fetch more.

**Smart Validations**  
- Can't create two tasks with the same name
- Title can't be empty or just spaces
- 1000 task limit (just in case)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── add-new/           # Task creation page
│   ├── edit/              # Task editing page
│   ├── api/trpc/          # API endpoints
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── delete-modal.tsx   # Confirmation dialogs
│   ├── individual-todo.tsx # Task item component
│   ├── new-todo-form.tsx  # Task form component
│   └── todo-list-manage.tsx # Main list component
├── server/                # Backend logic
│   └── routers/           # tRPC route definitions
├── types/                 # TypeScript definitions
└── utils/                 # Utility functions
```
---

*Made with ☕ and lots of TypeScript from Floripa, Brazil 🇧🇷*
