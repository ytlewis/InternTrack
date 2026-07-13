# Quick Start Guide - InternTrack

Get InternTrack up and running in minutes!

## Option 1: Quick Start with Docker (Recommended)

If you have Docker Desktop installed:

1. **Start MySQL with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Update .env file**
   ```bash
   # Add this line to your .env file
   DATABASE_URL=mysql://interntrack:interntrack123@localhost:3306/interntrack
   ```

3. **Push database schema**
   ```bash
   npm run db:push
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to http://localhost:5173
   - Click "Get Started" to create your account!

### Stop MySQL
```bash
docker-compose down
```

### Remove all data and start fresh
```bash
docker-compose down -v
docker-compose up -d
npm run db:push
```

## Option 2: Without Database (Testing Only)

You can run the app without MySQL, but data won't persist:

1. **Leave DATABASE_URL empty in .env**
   ```bash
   DATABASE_URL=
   ```

2. **Start the app**
   ```bash
   npm run dev
   ```

3. **Note:** All data will be lost when you restart the server!

## Option 3: Install MySQL Locally

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete MySQL installation instructions.

## Troubleshooting

### Docker not starting?
- Make sure Docker Desktop is running
- Check if port 3306 is already in use: `netstat -ano | findstr :3306`
- Try a different port in docker-compose.yml

### Can't connect to database?
- Verify MySQL is running: `docker ps` (for Docker)
- Check your DATABASE_URL matches your setup
- Wait a few seconds for MySQL to fully start

### Application errors?
- Check the terminal for error messages
- Make sure you ran `npm install`
- Try `npm run db:push` to sync the database schema

## Next Steps

1. **Create your first account**
   - Go to http://localhost:5173
   - Click "Get Started" or "Sign Up"
   - Choose your role (Student, Supervisor, Employer)

2. **Explore the features**
   - Students: Browse internships and apply
   - Employers: Post internship opportunities
   - Supervisors: Monitor student progress
   - Admins: Manage all users and opportunities

3. **Test different user roles**
   - Create multiple accounts with different roles
   - See how each role has different permissions and views

## Default Ports

- **Frontend:** http://localhost:5173
- **Backend API:** Integrated with frontend via Vite
- **MySQL:** localhost:3306

## Need Help?

- Check [README.md](./README.md) for complete documentation
- See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database help
- Open an issue on GitHub if you encounter problems

## Development Tips

- **Hot Reload:** Changes to React components update instantly
- **Database Schema Changes:** Run `npm run db:push` after modifying schema
- **Code Formatting:** Run `npm run format` to auto-format code
- **Type Checking:** Run `npm run check` to verify TypeScript types

Enjoy using InternTrack! 🎓
