# TodoList Application

A modern, responsive TodoList application built with Next.js, React, TypeScript, and Tailwind CSS. It features a clean user interface, local data persistence via localStorage, and an advanced task management system including a dedicated recycle bin sidebar.

---

## Features

- Task Management: Create, complete, edit, and delete tasks seamlessly with native Enter key support.
- Total Task Counter: Real-time counter tracking the total number of created tasks.
- Trash / Recycle Bin Sidebar: 
  - Smooth slide-over drawer for deleted tasks.
  - Ability to restore individual tasks back to the active list.
  - Option to empty the trash completely.
- Data Persistence: Automatically synchronizes active and deleted tasks with the browser's localStorage.
- Modern UI/UX: Styled with Tailwind CSS, featuring a centered title and optimized visual hierarchy.
- SSR Hydration Safe: Built-in client-side mounting guard to prevent Next.js server-side rendering mismatches.

---

## Tech Stack

- Framework: Next.js (React)
- Language: TypeScript
- Styling: Tailwind CSS
- State & Storage: React Hooks (useState, useEffect) & Browser localStorage

---

## Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites

Ensure you have Node.js (version 18 or higher recommended) installed on your system.

### Installation & Running

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>

### Install dependencies
- npm install

### Run the development server
- npm run dev

Open your browser and navigate to http://localhost:3000

### React Hydration Errors
 Cause: Discrepancies between what the server renders and what the client renders initially due to browser extensions or asynchronous local storage reads.

Solution: The application uses an isMounted state guard to ensure components relying on browser storage only render on the client side. If you encounter plugin conflicts, clear your Next.js cache:

- rm -rf .next
- npm run dev

### Issues when accessing via Local IP
Cause: Browsers and network firewalls may restrict local scripts, CORS policies, or isolate localStorage when accessing the app via local IP instead of localhost.

Solution:

Always develop and test using http://localhost:3000 as standard practice.

If you need to expose the server to your local network, start Next.js explicitly binding to all network interfaces:

- npm run dev -- -H 0.0.0.0

### Dependency Conflicts / Missing Modules
Cause: Corrupted node_modules or out-of-date packages.

Solution: Clean your environment completely and reinstall dependencies:

- rm -rf node_modules package-lock.json
- npm install