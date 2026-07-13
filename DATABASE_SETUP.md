# Database Setup Guide for InternTrack

## Prerequisites

InternTrack requires MySQL database to store application data. Follow the steps below to set up your database.

## Option 1: Install MySQL (Recommended for Windows)

### Method A: Using XAMPP (Easiest)

1. **Download XAMPP**
   - Visit: https://www.apachefriends.org/
   - Download the Windows installer
   - Run the installer and select MySQL during installation

2. **Start MySQL**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - MySQL will run on port 3306 by default

3. **Create Database**
   ```bash
   # Open Command Prompt and navigate to XAMPP MySQL bin folder
   cd C:\xampp\mysql\bin
   
   # Login to MySQL (default password is empty)
   mysql -u root -p
   
   # Create the database
   CREATE DATABASE interntrack;
   
   # Exit MySQL
   exit;
   ```

4. **Update .env file**
   ```env
   DATABASE_URL=mysql://root:@localhost:3306/interntrack
   ```
   
   If you set a password for root user:
   ```env
   DATABASE_URL=mysql://root:your_password@localhost:3306/interntrack
   ```

### Method B: Using MySQL Installer

1. **Download MySQL**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download MySQL Installer for Windows
   - Choose "mysql-installer-community"

2. **Install MySQL**
   - Run the installer
   - Choose "Developer Default" or "Server only"
   - Set a root password during installation
   - Complete the installation

3. **Create Database**
   ```bash
   # Open Command Prompt
   # Navigate to MySQL bin folder (usually C:\Program Files\MySQL\MySQL Server 8.0\bin)
   
   mysql -u root -p
   # Enter your password
   
   CREATE DATABASE interntrack;
   exit;
   ```

4. **Update .env file**
   ```env
   DATABASE_URL=mysql://root:your_password@localhost:3306/interntrack
   ```

## Option 2: Use Docker (For Advanced Users)

1. **Install Docker Desktop** for Windows from https://www.docker.com/products/docker-desktop

2. **Run MySQL Container**
   ```bash
   docker run --name interntrack-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=interntrack -p 3306:3306 -d mysql:8.0
   ```

3. **Update .env file**
   ```env
   DATABASE_URL=mysql://root:password@localhost:3306/interntrack
   ```

## Option 3: Cloud Database (Free Tier Available)

### PlanetScale (Recommended for Easy Setup)

1. **Sign up** at https://planetscale.com
2. **Create a new database** named "interntrack"
3. **Get connection string** from the dashboard
4. **Update .env file** with the provided connection string

### Railway

1. **Sign up** at https://railway.app
2. **Create MySQL database**
3. **Copy connection string**
4. **Update .env file**

## After Database Setup

1. **Run database migrations**
   ```bash
   npm run db:push
   ```

2. **Seed the database (optional)**
   ```bash
   # You can create seed data by running the seed script
   npm run db:seed
   ```

3. **Restart the development server**
   ```bash
   npm run dev
   ```

## Verify Database Connection

Once your dev server is running, try to:
1. Navigate to http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Create a test account
4. If successful, your database is properly configured!

## Troubleshooting

### Error: ECONNREFUSED

This means the MySQL server is not running or not accessible.

**Solution:**
- Make sure MySQL is running (check XAMPP Control Panel or Windows Services)
- Verify the port number (default is 3306)
- Check your DATABASE_URL in .env file

### Error: Access denied for user

This means your username or password is incorrect.

**Solution:**
- Double-check your DATABASE_URL credentials
- Make sure the user has proper permissions
- Reset MySQL root password if needed

### Error: Unknown database

This means the database doesn't exist.

**Solution:**
- Create the database: `CREATE DATABASE interntrack;`
- Make sure the database name in DATABASE_URL matches

## In-Memory Fallback

If you leave DATABASE_URL empty, the application will use an in-memory data store. 

**Note:** All data will be lost when the server restarts. This is only suitable for quick testing, not for actual use.

## Need Help?

- MySQL Documentation: https://dev.mysql.com/doc/
- XAMPP Documentation: https://www.apachefriends.org/docs/
- PlanetScale Documentation: https://planetscale.com/docs
