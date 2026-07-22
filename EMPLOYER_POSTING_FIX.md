# Employer Opportunity Posting Fix

## Issue
Employers were getting "failed query" and "failed fetch" errors when trying to post internship opportunities.

## Root Cause
The `findOpportunitiesByEmployer` function in `app/api/queries/opportunities.ts` had a critical bug:

```typescript
// BEFORE (WRONG):
const employerProfile = await getDb().query.employerProfiles.findFirst({
  where: eq(internshipOpportunities.employerId, employerUserId), // Wrong table reference!
});
```

The function was trying to query `employerProfiles` table but using the `internshipOpportunities.employerId` column in the WHERE clause, which caused a SQL error.

## Solution Applied
Fixed the query to use the correct table column reference:

```typescript
// AFTER (CORRECT):
const employerProfile = await getDb().query.employerProfiles.findFirst({
  where: eq(employerProfiles.userId, employerUserId), // Correct table reference
});
```

Also added the missing import for `employerProfiles` schema.

## Changes Made
1. **File**: `app/api/queries/opportunities.ts`
   - Added `employerProfiles` to the import statement from `@db/schema`
   - Fixed the WHERE clause in `findOpportunitiesByEmployer` to use `employerProfiles.userId` instead of `internshipOpportunities.employerId`

## Verification Steps
1. ✅ MySQL service is running (PID: 9644)
2. ✅ Database `interntrack` exists with all 10 tables
3. ✅ Test employer user exists (id: 1, email: test@gmail.com)
4. ✅ Employer profile exists for user 1
5. ✅ Dev server restarted and running on http://localhost:3000/

## How to Test
1. Navigate to http://localhost:3000/
2. Sign in as employer using: test@gmail.com
3. Go to "Post Opportunity" or navigate to `/employer/new-opportunity`
4. Fill out the form:
   - Title: e.g., "Software Developer Intern"
   - Description: e.g., "Join our team..."
   - Optional fields: location, duration, requirements, slots
5. Click "Post Opportunity"
6. Should see success message: "Opportunity posted! Awaiting admin approval."
7. Check the employer opportunities list to see the posted opportunity

## Expected Behavior
- ✅ No more "failed query" errors
- ✅ No more "failed fetch" errors
- ✅ Opportunity is created with status "pending"
- ✅ Opportunity appears in employer's list
- ✅ Admin can approve/reject the opportunity
- ✅ Students can view approved opportunities

## Database Status
```
Users: 1 employer (test@gmail.com)
Employer Profiles: 1 profile (Test Company)
Opportunities: Ready to accept new postings
```

## Next Steps for Full Testing
1. Test creating multiple opportunities
2. Test that students can view approved opportunities
3. Test that students can apply for opportunities
4. Test admin approval/rejection workflow

---
**Status**: ✅ FIXED - Ready for Testing
**Date**: July 22, 2026
**Dev Server**: Running on http://localhost:3000/
