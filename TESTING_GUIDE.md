# InternTrack Testing Guide

**Date**: July 22, 2026, 12:50 PM
**Status**: ✅ System Ready for Testing

---

## 🎯 Quick Start

### System is Running:
- ✅ MySQL Server: Port 3306
- ✅ Dev Server: http://localhost:3000
- ✅ Database: `interntrack` with 10 tables
- ✅ All fixes applied and committed

### Latest Fix:
**Employer Profile Auto-Creation** ✅
- Employers can now sign up and immediately post opportunities
- No manual profile creation needed
- "Employer profile not found" error eliminated

---

## 🧪 Test Scenarios

### Test 1: Existing Employer Can Post ⭐ START HERE

**Goal**: Verify the existing test employer can post opportunities

**Credentials**:
- Email: test@gmail.com
- Role: Employer
- Profile: Already created (id=1)

**Steps**:
1. Open browser to http://localhost:3000
2. Click "Sign In"
3. Enter email: test@gmail.com
4. Select role: Employer
5. Click "Sign In"
6. ✅ Should land on employer dashboard
7. Click "Post Opportunity" or "Create Opportunity"
8. Fill in the form:
   ```
   Title: Frontend Developer Intern
   Description: Join our team to build modern web applications using React and TypeScript
   Requirements: HTML, CSS, JavaScript, React basics
   Location: Nairobi, Kenya
   Duration: 3 months
   Slots Available: 2
   ```
9. Click "Post Opportunity"

**Expected Result**:
- ✅ Success message: "Opportunity posted! Awaiting admin approval."
- ✅ Redirected to opportunities list
- ✅ Opportunity shows with status "pending"
- ✅ NO error messages

**Verify in Database**:
```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "USE interntrack; SELECT id, employerId, title, status FROM internshipopportunities;"
```

Expected output:
```
+----+------------+---------------------------+---------+
| id | employerId | title                     | status  |
+----+------------+---------------------------+---------+
|  1 |          1 | Frontend Developer Intern | pending |
+----+------------+---------------------------+---------+
```

---

### Test 2: New Employer Signup & Post

**Goal**: Verify new employers get profiles automatically

**Steps**:
1. Open browser to http://localhost:3000
2. Click "Sign Up"
3. Select role: Employer
4. Fill in details:
   ```
   Name: Tech Solutions Ltd
   Email: employer@techsolutions.com
   ```
5. Click "Sign Up"
6. ✅ Should land on employer dashboard
7. Click "Post Opportunity"
8. Fill in form:
   ```
   Title: Backend Developer Intern
   Description: Work with our backend team on API development
   Requirements: Python or Node.js knowledge
   Location: Mombasa, Kenya
   Duration: 4 months
   Slots Available: 1
   ```
9. Submit

**Expected Result**:
- ✅ Signup successful
- ✅ Employer profile auto-created
- ✅ Can post opportunity immediately
- ✅ NO "profile not found" error

**Verify in Database**:
```powershell
# Check user and profile created
C:\xampp\mysql\bin\mysql.exe -u root -e "USE interntrack; SELECT u.id, u.name, u.email, ep.companyName FROM users u LEFT JOIN employerprofiles ep ON u.id = ep.userId WHERE u.email = 'employer@techsolutions.com';"
```

Expected output:
```
+----+--------------------+----------------------------+--------------------+
| id | name               | email                      | companyName        |
+----+--------------------+----------------------------+--------------------+
|  2 | Tech Solutions Ltd | employer@techsolutions.com | Tech Solutions Ltd |
+----+--------------------+----------------------------+--------------------+
```

---

### Test 3: Student Signup & Browse

**Goal**: Verify students can sign up and view opportunities

**Steps**:
1. Sign out (if signed in)
2. Click "Sign Up"
3. Select role: Student
4. Fill in details:
   ```
   Name: John Doe
   Email: john.doe@student.com
   Student ID: STU2024001
   Program: Computer Science
   Year of Study: 3
   Institution: University of Nairobi
   ```
5. Click "Sign Up"
6. ✅ Should land on student dashboard
7. Navigate to "Browse Internships" or "Internships"
8. View available opportunities

**Expected Result**:
- ✅ Signup successful
- ✅ Can see approved opportunities
- ✅ Each opportunity shows company, location, duration

**Note**: Opportunities need admin approval first to show to students

---

### Test 4: Admin Approval

**Goal**: Approve pending opportunities so students can apply

**Steps**:
1. Sign out
2. Sign in as admin (or create admin account)
3. Navigate to admin dashboard
4. View "Pending Opportunities"
5. Click "Approve" on an opportunity
6. ✅ Status changes to "approved"

**Expected Result**:
- ✅ Opportunity status updated
- ✅ Now visible to students
- ✅ Students can apply

**Verify in Database**:
```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "USE interntrack; SELECT id, title, status FROM internshipopportunities WHERE status = 'approved';"
```

---

### Test 5: Student Application

**Goal**: Verify students can apply for approved opportunities

**Prerequisites**:
- At least one opportunity must be approved (Test 4)
- Signed in as student

**Steps**:
1. Navigate to "Browse Internships"
2. Find an approved opportunity
3. Click "View Details" or "Apply Now"
4. Write cover letter:
   ```
   I am very interested in this internship opportunity.
   I have strong skills in web development and am eager to learn.
   I am available for the full duration and committed to excellence.
   ```
5. Click "Submit Application"

**Expected Result**:
- ✅ Success message: "Application submitted!"
- ✅ Application appears in "My Applications"
- ✅ Status shows as "pending"
- ✅ Employer can view application

**Verify in Database**:
```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "USE interntrack; SELECT id, studentId, opportunityId, status FROM applications;"
```

---

## 📋 Comprehensive Test Checklist

### Authentication:
- [ ] Employer signup works
- [ ] Student signup works
- [ ] Supervisor signup works
- [ ] Sign in with email works
- [ ] Sign out works
- [ ] Role validation works (can't sign in with wrong role)

### Employer Features:
- [ ] Employer profile auto-created on signup ✅
- [ ] Can post internship opportunity ✅
- [ ] Can view own opportunities
- [ ] Can see opportunity status (pending/approved)
- [ ] Can edit opportunities (if implemented)
- [ ] Can view applications to their opportunities

### Student Features:
- [ ] Student profile created on signup
- [ ] Can browse approved opportunities
- [ ] Can view opportunity details
- [ ] Can apply with cover letter
- [ ] Can view own applications
- [ ] Can track application status

### Admin Features:
- [ ] Can view all pending opportunities
- [ ] Can approve opportunities
- [ ] Can reject opportunities
- [ ] Can view all users
- [ ] Can manage system

### Database:
- [ ] All tables present (10 tables)
- [ ] Auto-increment IDs working
- [ ] Foreign keys working
- [ ] No insert errors
- [ ] Relations loading correctly

---

## 🔍 Debugging Commands

### Check All Users:
```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "USE interntrack; SELECT id, name, email, role FROM users;"
```

### Check Employer Profiles:
```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "USE interntrack; SELECT ep.id, ep.userId, ep.companyName, u.name, u.email FROM employerprofiles ep JOIN users u ON ep.userId = u.id;"
```

### Check Opportunities:
```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "USE interntrack; SELECT io.id, io.title, io.status, ep.companyName FROM internshipopportunities io JOIN employerprofiles ep ON io.employerId = ep.id;"
```

### Check Applications:
```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "USE interntrack; SELECT a.id, s.userId as student, io.title, a.status FROM applications a JOIN studentprofiles s ON a.studentId = s.id JOIN internshipopportunities io ON a.opportunityId = io.id;"
```

### Check Server Logs:
Look at Terminal 5 for any errors:
- Database connection errors
- Query errors
- Authentication errors

---

## 🐛 Common Issues & Solutions

### Issue: "Employer profile not found"
**Status**: ✅ FIXED
**Solution**: Profiles now auto-created during signup

### Issue: Can't sign in
**Solution**:
- Check email spelling
- Verify role matches signup role
- Check database for user existence

### Issue: Opportunities not showing for students
**Solution**:
- Opportunities must be approved by admin first
- Check status in database
- Sign in as admin and approve

### Issue: Database connection error
**Solution**:
```powershell
# Check MySQL is running
Get-Process mysqld

# If not running, start XAMPP MySQL
C:\xampp\xampp-control.exe
# Click "Start" next to MySQL
```

### Issue: Dev server not responding
**Solution**:
```powershell
# Restart dev server
# Stop current process (Ctrl+C in terminal)
# Then run:
npm run dev
```

---

## 📊 Expected Database State After Full Test

### users table:
```
+----+--------------------+----------------------------+------------+
| id | name               | email                      | role       |
+----+--------------------+----------------------------+------------+
|  1 | test               | test@gmail.com             | employer   |
|  2 | Tech Solutions Ltd | employer@techsolutions.com | employer   |
|  3 | John Doe           | john.doe@student.com       | student    |
+----+--------------------+----------------------------+------------+
```

### employerprofiles table:
```
+----+--------+--------------------+
| id | userId | companyName        |
+----+--------+--------------------+
|  1 |      1 | Test Company       |
|  2 |      2 | Tech Solutions Ltd |
+----+--------+--------------------+
```

### internshipopportunities table:
```
+----+------------+---------------------------+----------+
| id | employerId | title                     | status   |
+----+------------+---------------------------+----------+
|  1 |          1 | Frontend Developer Intern | approved |
|  2 |          2 | Backend Developer Intern  | pending  |
+----+------------+---------------------------+----------+
```

### applications table:
```
+----+-----------+---------------+---------+
| id | studentId | opportunityId | status  |
+----+-----------+---------------+---------+
|  1 |         1 |             1 | pending |
+----+-----------+---------------+---------+
```

---

## 🎯 Success Criteria

**Test is successful if:**
- ✅ Employers can sign up
- ✅ Employer profiles auto-created
- ✅ Employers can post opportunities
- ✅ NO "profile not found" errors
- ✅ Students can sign up
- ✅ Students can browse opportunities
- ✅ Students can apply
- ✅ Admin can approve
- ✅ No database errors
- ✅ No server crashes

---

## 📝 Test Report Template

After testing, document results:

```
=== INTERNTRACK TEST REPORT ===
Date: [Date]
Tester: [Your Name]

Test 1: Existing Employer Post
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test 2: New Employer Signup
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test 3: Student Signup & Browse
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test 4: Admin Approval
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test 5: Student Application
Status: [ ] Pass [ ] Fail
Notes: _______________________

Issues Found:
1. _______________________
2. _______________________

Overall Status: [ ] All Pass [ ] Some Fail
```

---

## 🚀 Ready to Test!

**Current System State**:
- ✅ MySQL Running
- ✅ Dev Server Running
- ✅ All Fixes Applied
- ✅ Database Ready
- ✅ Test User Ready (test@gmail.com)

**Start Testing Now**:
1. Open http://localhost:3000
2. Follow Test 1 above
3. Verify success
4. Continue with remaining tests

---

**Good luck with testing! Everything should work perfectly now! 🎉**
