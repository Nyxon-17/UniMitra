import app from '../app.js';
import http from 'http';
import { prisma } from '../config/prisma.js';

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/v1/auth`;
  console.log(`\n======================================================`);
  console.log(`🧪 TESTING AUTHENTICATION & DATABASE CONNECTIVITY`);
  console.log(`======================================================\n`);

  const timestamp = Date.now();
  const testStudentEmail = `student_${timestamp}@unimitra.edu.in`;
  const testStudentPass = 'StudentPass123!';
  const testFacultyEmail = `faculty_${timestamp}@dibru.ac.in`;
  const testFacultyPass = 'FacultyPass123!';

  try {
    // -----------------------------------------------------------------
    // TEST 1: Student Registration (DB insert)
    // -----------------------------------------------------------------
    console.log(`1. Testing Student Registration in Database...`);
    const regRes = await fetch(`${baseUrl}/student/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Pranjal Barua',
        email: testStudentEmail,
        password: testStudentPass,
        preferredLanguage: 'as',
      }),
    });

    const regJson = await regRes.json();
    if (!regJson.success) {
      throw new Error(`Student registration failed: ${JSON.stringify(regJson)}`);
    }

    console.log(`   ✅ Student Registered: ${regJson.data.user.email} (ID: ${regJson.data.user.id})`);

    // Verify record in Supabase PostgreSQL
    const studentDbRecord = await prisma.profile.findUnique({
      where: { email: testStudentEmail },
    });
    if (!studentDbRecord) {
      throw new Error('Student record was not found in Supabase database!');
    }
    console.log(`   ✅ Verified in Supabase PostgreSQL: fullName="${studentDbRecord.fullName}", role="${studentDbRecord.role}"`);

    // -----------------------------------------------------------------
    // TEST 2: Student Login (Password hash verification + JWT)
    // -----------------------------------------------------------------
    console.log(`\n2. Testing Student Login & Password Hash Verification...`);
    const loginRes = await fetch(`${baseUrl}/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testStudentEmail,
        password: testStudentPass,
      }),
    });

    const loginJson = await loginRes.json();
    if (!loginJson.success || !loginJson.data.token) {
      throw new Error(`Student login failed: ${JSON.stringify(loginJson)}`);
    }

    const studentToken = loginJson.data.token;
    console.log(`   ✅ Student Login Succeeded! JWT Token generated.`);

    // -----------------------------------------------------------------
    // TEST 3: Authenticated Profile Fetch (/me)
    // -----------------------------------------------------------------
    console.log(`\n3. Testing GET /api/v1/auth/me with Bearer Token...`);
    const meRes = await fetch(`${baseUrl}/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const meJson = await meRes.json();
    if (!meJson.success || meJson.data.user.email !== testStudentEmail) {
      throw new Error(`Profile fetch failed: ${JSON.stringify(meJson)}`);
    }
    console.log(`   ✅ Authenticated Profile Retrieved: ${meJson.data.user.fullName} [${meJson.data.user.role}]`);

    // -----------------------------------------------------------------
    // TEST 4: Faculty Registration (Auto-generates Member ID)
    // -----------------------------------------------------------------
    console.log(`\n4. Testing Faculty Registration & Member ID Generation...`);
    const facRegRes = await fetch(`${baseUrl}/faculty/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Dr. Hiranya Kumar Saikia',
        officialEmail: testFacultyEmail,
        department: 'Computer Science & Engineering',
        designation: 'Associate Professor',
        password: testFacultyPass,
      }),
    });

    const facRegJson = await facRegRes.json();
    if (!facRegJson.success || !facRegJson.data.memberId) {
      throw new Error(`Faculty registration failed: ${JSON.stringify(facRegJson)}`);
    }

    const facultyMemberId = facRegJson.data.memberId;
    console.log(`   ✅ Faculty Registered: Member ID = ${facultyMemberId}`);

    // Verify in Supabase
    const facultyDbRecord = await prisma.profile.findUnique({
      where: { memberId: facultyMemberId },
    });
    if (!facultyDbRecord) {
      throw new Error('Faculty record was not found in Supabase database!');
    }
    console.log(`   ✅ Verified in Supabase: memberId="${facultyDbRecord.memberId}", department="${facultyDbRecord.department}"`);

    // -----------------------------------------------------------------
    // TEST 5: Faculty Login Step 1 (Member ID & Password -> OTP)
    // -----------------------------------------------------------------
    console.log(`\n5. Testing Faculty Login Step 1 (Credentials -> OTP Trigger)...`);
    const facLoginRes = await fetch(`${baseUrl}/faculty/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: facultyMemberId,
        password: testFacultyPass,
      }),
    });

    const facLoginJson = await facLoginRes.json();
    if (!facLoginJson.success || !facLoginJson.data.requiresOtp) {
      throw new Error(`Faculty credentials login failed: ${JSON.stringify(facLoginJson)}`);
    }
    console.log(`   ✅ Faculty Step 1 Accepted: requiresOtp = true`);

    // -----------------------------------------------------------------
    // TEST 6: Faculty Login Step 2 (Verify OTP -> JWT Token)
    // -----------------------------------------------------------------
    console.log(`\n6. Testing Faculty Step 2 (Verify OTP -> JWT)...`);
    const facOtpRes = await fetch(`${baseUrl}/faculty/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: facultyMemberId,
        otp: '123456', // Dev fallback / active OTP
      }),
    });

    const facOtpJson = await facOtpRes.json();
    if (!facOtpJson.success || !facOtpJson.data.token) {
      throw new Error(`Faculty OTP verification failed: ${JSON.stringify(facOtpJson)}`);
    }
    console.log(`   ✅ Faculty OTP Verified! Token issued for: ${facOtpJson.data.user.fullName}`);

    // -----------------------------------------------------------------
    // TEST 7: Admin Login (admin@unimitra.edu.in / admin@unimitra)
    // -----------------------------------------------------------------
    console.log(`\n7. Testing Super Admin Login...`);
    const adminLoginRes = await fetch(`${baseUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@unimitra.edu.in',
        password: 'admin@unimitra',
      }),
    });

    const adminLoginJson = await adminLoginRes.json();
    if (!adminLoginJson.success || !adminLoginJson.data.requiresOtp) {
      throw new Error(`Admin login failed: ${JSON.stringify(adminLoginJson)}`);
    }
    console.log(`   ✅ Super Admin Credentials Accepted!`);

    // Admin Step 2: OTP
    const adminOtpRes = await fetch(`${baseUrl}/admin/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'admin@unimitra.edu.in',
        otp: '123456',
      }),
    });

    const adminOtpJson = await adminOtpRes.json();
    if (!adminOtpJson.success || !adminOtpJson.data.token) {
      throw new Error(`Admin OTP verification failed: ${JSON.stringify(adminOtpJson)}`);
    }
    console.log(`   ✅ Super Admin Verified! Token issued for: ${adminOtpJson.data.user.email} [${adminOtpJson.data.user.role}]`);

    // Clean up test records
    await prisma.profile.deleteMany({
      where: { email: { in: [testStudentEmail, testFacultyEmail] } },
    });
    console.log(`\n🧹 Cleaned up temporary test accounts.`);

    console.log(`\n======================================================`);
    console.log(`🎉 ALL 7 AUTHENTICATION & DATABASE TESTS PASSED!`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error(`\n❌ AUTHENTICATION TEST FAILED:`, err);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
});

