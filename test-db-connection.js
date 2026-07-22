// Quick test script to verify database connection and queries
import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";

const DATABASE_URL = "mysql://root:@localhost:3306/interntrack";

async function testConnection() {
  console.log("Testing database connection...");
  console.log("URL:", DATABASE_URL);
  
  try {
    const connection = await createConnection(DATABASE_URL);
    console.log("✅ Connection successful!");
    
    // Test query
    const [rows] = await connection.execute("SELECT * FROM users WHERE role = 'employer'");
    console.log("✅ Users query successful. Found employers:", rows.length);
    console.log("Employers:", rows);
    
    // Test employer profiles
    const [profiles] = await connection.execute("SELECT * FROM employerprofiles");
    console.log("✅ Employer profiles query successful. Found profiles:", profiles.length);
    console.log("Profiles:", profiles);
    
    // Test opportunity insert
    if (profiles.length > 0) {
      const employerId = profiles[0].id;
      console.log("\nTesting opportunity insert with employerId:", employerId);
      
      const [insertResult] = await connection.execute(
        `INSERT INTO internshipopportunities 
         (employerId, title, description, slotsAvailable, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [employerId, "Test Opportunity", "Test Description", 1, "pending"]
      );
      
      console.log("✅ Insert successful!");
      console.log("Insert ID:", insertResult.insertId);
      
      // Clean up test data
      await connection.execute(
        "DELETE FROM internshipopportunities WHERE id = ?",
        [insertResult.insertId]
      );
      console.log("✅ Test data cleaned up");
    }
    
    await connection.end();
    console.log("\n✅ All tests passed!");
    
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error("Full error:", err);
  }
}

testConnection();
