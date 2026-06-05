async function test() {
  try {
    // 1. Login as admin to get token
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@pelindo.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.error);
    
    const token = loginData.token;
    console.log("Token received:", token.substring(0, 20) + "...");

    // 2. Fetch biodata
    const biodataRes = await fetch('http://localhost:3001/api/admin/biodata', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const biodataData = await biodataRes.json();
    console.log("Admin Biodata Response:", JSON.stringify(biodataData, null, 2));

  } catch (error) {
    console.error("Error:", error.message);
  }
}

test();
