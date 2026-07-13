# Manual Database Setup Instructions

## Current Status

- ✅ DATABASE_URL is configured in `.env` file
- ✅ Connection string: `mysql://interntrack:interntrack123@localhost:3306/interntrack`
- ✅ Docker Compose configuration is ready
- ⚠️ MySQL container needs to be started

## Option 1: Using Docker Desktop (Recommended)

### Step 1: Start Docker Desktop
1. **Manually open Docker Desktop** from Windows Start Menu
2. **Wait** for Docker Desktop to fully start (icon in system tray will stop animating)
3. **Verify** Docker is running by opening PowerShell and running:
   ```powershell
   docker ps
   ```
   If you see a table output (even if empty), Docker is running!

### Step 2: Start MySQL Container
Once Docker is running, open PowerShell in the project directory and run:

```powershell
cd c:\Users\gatha\OneDrive\Desktop\Interntrack\app
docker-compose up -d
```

You should see:
```
Creating interntrack-mysql ... done
```

### Step 3: Wait for MySQL to Initialize
Wait about 15-20 seconds for MySQL to fully start.

### Step 4: Push Database Schema
```powershell
npm run db:push
```

### Step 5: Restart Development Server
1. Stop the current dev server (Ctrl+C in the terminal running `npm run dev`)
2. Start it again:
   ```powershell
   npm run dev
   ```

### Step 6: Test the Application
1. Open http://localhost:5173
2. Click "Get Started"
3. Create a new account
4. If successful - database is working! 🎉

## Option 2: Using PowerShell Script (Automated)

If Docker Desktop is running, you can use the automated script:

```powershell
.\setup-database.ps1
```

This script will:
- Check if Docker is running
- Start MySQL container
- Update environment variables
- Push database schema
- Give you next steps

## Option 3: Install XAMPP (Alternative)

If Docker continues to have issues:

1. **Install XAMPP**
   ```powershell
   winget install ApacheFriends.XAMPP.8.2
   ```

2. **Start XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL

3. **Create Database**
   - Open Command Prompt
   - Navigate to XAMPP MySQL:
     ```cmd
     cd C:\xampp\mysql\bin
     mysql -u root -p
     ```
   - Press Enter (no password by default)
   - Create database:
     ```sql
     CREATE DATABASE interntrack;
     exit;
     ```

4. **Update .env file**
   Change the DATABASE_URL line to:
   ```env
   DATABASE_URL=mysql://root:@localhost:3306/interntrack
   ```

5. **Push Database Schema**
   ```powershell
   npm run db:push
   ```

6. **Restart Dev Server**
   - Ctrl+C to stop
   - `npm run dev` to start

## Option 4: Cloud Database (No Local Install)

### Using PlanetScale (Free Tier)

1. **Sign up** at https://planetscale.com
2. **Create database** named "interntrack"
3. **Get connection string** from dashboard
4. **Update .env** with the connection string from PlanetScale
5. **Run** `npm run db:push`
6. **Restart** dev server

### Using Railway (Free Tier)

1. **Sign up** at https://railway.app
2. **New Project** → **Provision MySQL**
3. **Copy** connection string
4. **Update .env** with Railway connection string
5. **Run** `npm run db:push`
6. **Restart** dev server

## Verify Connection

Once set up, check if the database is connected:

1. Start your dev server: `npm run dev`
2. Check terminal output - you should NOT see database connection errors
3. Try to create an account at http://localhost:5173
4. If account creation succeeds, database is working!

## Troubleshooting Docker

### Docker Desktop Won't Start

**Solution 1: Restart Windows**
- Save your work
- Restart computer
- Open Docker Desktop after restart

**Solution 2: Reinstall Docker Desktop**
- Uninstall Docker Desktop
- Download fresh copy from https://docker.com
- Install and restart

**Solution 3: Check Windows Features**
- Open PowerShell as Administrator
- Run: `wsl --install`
- Restart computer
- Try Docker Desktop again

### Port 3306 Already in Use

If you get "port already in use" error:

**Find what's using the port:**
```powershell
netstat -ano | findstr :3306
```

**Stop MySQL service if exists:**
```powershell
net stop MySQL80
```

**Or change Docker port in docker-compose.yml:**
```yaml
ports:
  - "3307:3306"  # Use 3307 instead
```

Then update .env:
```env
DATABASE_URL=mysql://interntrack:interntrack123@localhost:3307/interntrack
```

## Current Configuration

Your `.env` file is already configured with:
```env
DATABASE_URL=mysql://interntrack:interntrack123@localhost:3306/interntrack
```

This matches the Docker Compose configuration in `docker-compose.yml`.

## Quick Reference

### Docker Commands
```powershell
# Start MySQL
docker-compose up -d

# Stop MySQL
docker-compose down

# View logs
docker-compose logs -f

# Restart MySQL
docker-compose restart

# Remove all data and restart fresh
docker-compose down -v
docker-compose up -d
npm run db:push
```

### Database Commands
```powershell
# Push schema to database
npm run db:push

# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate
```

## Need Help?

- Check logs: `docker-compose logs mysql`
- Verify container is running: `docker ps`
- Test connection: Try creating an account in the app
- See main documentation: `README.md` and `DATABASE_SETUP.md`

---

**Note:** The `.env` file already has DATABASE_URL configured. You just need to get MySQL running using one of the options above!
