# InternTrack - Student Internship Management System

InternTrack is a comprehensive web-based platform designed to streamline the internship management process for students, supervisors, employers, and administrators.

## Features

### 🎓 For Students
- Browse and search approved internship opportunities
- Submit applications with cover letters and documents
- Track application status in real-time
- Submit weekly logbooks and final reports
- View supervisor evaluations and feedback
- Receive notifications for application updates

### 👨‍🏫 For Supervisors
- Monitor assigned students' progress
- Review and approve student reports
- Provide ratings and written feedback
- Track multiple supervisees simultaneously
- Manage placement evaluations

### 🏢 For Employers
- Post internship opportunities
- Review student applications
- Shortlist and select candidates
- Evaluate intern performance
- Manage multiple internship listings

### 🔐 For Administrators
- Manage all system users
- Approve internship opportunities
- Oversee all applications
- Match students to supervisors
- Generate comprehensive reports
- Export data for analysis

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Hono, tRPC, Node.js
- **Database:** MySQL (with Drizzle ORM)
- **Build Tool:** Vite
- **Authentication:** JWT-based auth system
- **State Management:** TanStack Query (React Query)

## Prerequisites

- Node.js 20 or higher
- MySQL 8.0 or higher (or Docker)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ytlewis/InternTrack.git
   cd InternTrack/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL` - Your MySQL connection string
   - `APP_SECRET` - A secure secret key for JWT signing
   - Other optional configuration

4. **Set up the database**
   
   See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.
   
   Quick start:
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE interntrack;
   exit;
   
   # Push schema to database
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   
   Open http://localhost:5173 in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Type check with TypeScript
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations

## Project Structure

```
app/
├── api/                    # Backend API code
│   ├── kimi/              # Authentication modules
│   ├── lib/               # Utility libraries
│   ├── queries/           # Database queries
│   └── *Router.ts         # API route handlers
├── contracts/             # Shared types and constants
├── db/                    # Database schema and config
│   ├── schema.ts          # Drizzle schema definitions
│   └── relations.ts       # Database relationships
├── src/                   # Frontend code
│   ├── components/        # React components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── employer/      # Employer pages
│   │   ├── student/       # Student pages
│   │   └── supervisor/    # Supervisor pages
│   ├── providers/         # Context providers
│   └── App.tsx            # Root component
└── index.html             # Entry HTML file
```

## User Roles

### Student
Default role for new registrations. Students can browse internships, apply, and submit reports.

### Supervisor
Academic supervisors who monitor student progress and provide evaluations.

### Employer
Company representatives who post internship opportunities and evaluate interns.

### Administrator
System administrators with full access to manage users, opportunities, and reports.

## Database Schema

The application uses the following main tables:
- `users` - User accounts and authentication
- `studentProfiles` - Student-specific information
- `supervisorProfiles` - Supervisor details
- `employerProfiles` - Employer/company information
- `internshipOpportunities` - Internship listings
- `applications` - Student applications
- `placements` - Approved internships with supervisor assignments
- `reports` - Weekly logbooks and final reports
- `evaluations` - Supervisor and employer evaluations
- `notifications` - System notifications

See `db/schema.ts` for complete schema definitions.

## Default Users

After database setup, you can create test users by signing up through the UI.

To make a user an administrator, set their `unionId` in the `OWNER_UNION_ID` environment variable.

## Deployment

### Production Build

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

### Environment Variables for Production

Make sure to set secure values for:
- `APP_SECRET` - Use a strong random string
- `DATABASE_URL` - Your production database
- `NODE_ENV=production`

### Hosting Options

- **Frontend:** Vercel, Netlify, or any static hosting
- **Backend:** Render, Railway, Heroku, or VPS
- **Database:** PlanetScale, Railway, AWS RDS, or any MySQL host

## Development

### Code Style

- ESLint for linting
- Prettier for code formatting
- TypeScript for type safety

Run `npm run lint` and `npm run format` before committing.

### Adding UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add button
```

Components are installed in `src/components/ui/`

## Troubleshooting

### Database Connection Issues

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed troubleshooting steps.

### Port Already in Use

If port 5173 is in use, Vite will automatically try the next available port.

### Build Errors

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is for educational purposes.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

