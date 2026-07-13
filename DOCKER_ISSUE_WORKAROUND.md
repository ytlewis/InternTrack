# Docker Desktop Issue - Alternative Solutions

## Problem
Docker Desktop is unable to start on your system. This is preventing the MySQL container from running.

## Quick Solution: Use a Free Cloud Database

Since Docker is having issues, the fastest way to get your database working is to use a free cloud MySQL database.

### Option 1: FreeSQLDatabase.com (Instant, No Signup)

1. **Visit** https://www.freesqldatabase.com/

2. **Get Free Database** - They provide instant MySQL databases with:
   - Host, Database name, Username, Password
   - 5MB storage (enough for testing)
   - No credit card required

3. **Update your .env file**:
   ```env
   DATABASE_URL=mysql://username:password@host:port/database
   ```
   Replace with the credentials they provide.

4. **Push database schema**:
   ```powershell
   npm run db:push
   ```

5. **Restart dev server**:
   - Stop with Ctrl+C
   - Run `npm run dev`

### Option 2: Railway.app (Free $5 Credit)

1. **Sign up** at https://railway.app with GitHub

2. **New Project** → **Provision MySQL**

3. **Get Connection String**:
   - Click on MySQL service
   - Go to "Connect" tab
   - Copy "MySQL Connection URL"

4. **Update .env**:
   ```env
   DATABASE_URL=mysql://root:password@host:port/railway
   ```

5. **Push schema**: `npm run db:push`

6. **Restart server**: `npm run dev`

### Option 3: Install XAMPP (Local Alternative)

If you prefer local database without Docker:

1. **Install XAMPP**:
   ```powershell
   winget install ApacheFriends.XAMPP.8.2
   ```

2. **Start XAMPP**:
   - Open XAMPP Control Panel from Start Menu
   - Click "Start" next to MySQL (NOT Apache)
   - Wait for it to show "Running"

3. **Create Database**:
   ```powershell
   cd C:\xampp\mysql\bin
   .\mysql.exe -u root
   ```
   
   In MySQL prompt:
   ```sql
   CREATE DATABASE interntrack;
   exit;
   ```

4. **Update .env**:
   ```env
   DATABASE_URL=mysql://root:@localhost:3306/interntrack
   ```

5. **Push schema**: `npm run db:push`

6. **Restart server**: `npm run dev`

## Fix Docker Desktop (For Future)

If you want to fix Docker Desktop for later use:

### Method 1: Complete Reinstall

1. **Uninstall Docker Desktop**:
   ```powershell
   winget uninstall Docker.DockerDesktop
   ```

2. **Remove Docker data**:
   ```powershell
   Remove-Item "$env:LOCALAPPDATA\Docker" -Recurse -Force
   Remove-Item "$env:APPDATA\Docker" -Recurse -Force
   ```

3. **Restart Windows**

4. **Install WSL 2**:
   ```powershell
   wsl --install
   ```
   Restart if needed.

5. **Reinstall Docker Desktop**:
   ```powershell
   winget install Docker.DockerDesktop
   ```

6. **Start Docker Desktop** and wait for full initialization

### Method 2: Reset Docker Desktop

1. Open Docker Desktop (from Start Menu)
2. Click Settings (gear icon)
3. Go to "Troubleshoot"
4. Click "Reset to factory defaults"
5. Confirm and wait
6. Restart Docker Desktop

### Method 3: Enable Virtualization

Docker requires virtualization to be enabled in BIOS:

1. Restart computer
2. Enter BIOS (usually F2, F10, F12, or Del during startup)
3. Find "Virtualization" or "VT-x" or "AMD-V"
4. Enable it
5. Save and exit
6. Start Docker Desktop

## Recommended Immediate Action

**Use Option 2 (Railway.app) or Option 3 (XAMPP) for now.**

These will get your database working in under 5 minutes, and you can switch to Docker later if needed.

## Test Your Database Connection

Once you've set up the database using any method:

1. Make sure dev server is running: `npm run dev`
2. Visit http://localhost:5173
3. Click "Get Started"
4. Fill in the form and click "Create account"
5. If it succeeds and takes you to a dashboard - **DATABASE IS WORKING!** ✅

## Current Status

- ✅ docker-compose.yml is fixed (removed deprecated version field)
- ⚠️ Docker Desktop daemon won't start
- ✅ Alternative solutions provided above
- ✅ .env is already configured (just need working MySQL)

## Quick Commands Reference

### For Railway/Cloud Database:
```powershell
# After getting connection string and updating .env
npm run db:push
npm run dev
```

### For XAMPP:
```powershell
# After installing and starting MySQL in XAMPP
cd C:\xampp\mysql\bin
.\mysql.exe -u root -e "CREATE DATABASE interntrack;"
cd c:\Users\gatha\OneDrive\Desktop\Interntrack\app
npm run db:push
npm run dev
```

---

**Pick whichever option is fastest for you. Railway or XAMPP are both good choices!**
