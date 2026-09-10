

async function testAuthSystem() {
  const baseUrl = 'http://localhost:3000';

  console.log('--- Salankarik Auth System Test ---');

  // Test 1: Accessing protected route without a token
  console.log('\n1. Accessing /auth/me without token');
  let res = await fetch(`${baseUrl}/auth/me`);
  console.log('Status:', res.status, await res.json());

  // Test 2: Invalid Login
  console.log('\n2. Attempting login with wrong password');
  res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@salankarik.test', password: 'wrongpassword' })
  });
  console.log('Status:', res.status, await res.json());

  // Test 3: Valid Login
  console.log('\n3. Attempting login with correct credentials');
  res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@salankarik.test', password: 'password123' })
  });
  const loginData = await res.json();
  console.log('Status:', res.status);
  console.log('Token extracted successfully:', !!loginData?.data?.access_token);
  
  const token = loginData.data.access_token;

  // Test 4: Access protected route with token
  console.log('\n4. Accessing /auth/me with valid token');
  res = await fetch(`${baseUrl}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Status:', res.status);
  console.log('User Profile:', await res.json());

  // Test 5: Access admin-only route with admin token
  console.log('\n5. Accessing /auth/admin-only with Admin role');
  res = await fetch(`${baseUrl}/auth/admin-only`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Status:', res.status);
  console.log('Response:', await res.json());

  // Test 6: Simulating a token for a non-admin role (by decoding and changing the role)
  console.log('\n6. Accessing /auth/admin-only with a fake invalid token');
  res = await fetch(`${baseUrl}/auth/admin-only`, {
    headers: { 'Authorization': `Bearer invalid.fake.token` }
  });
  console.log('Status:', res.status, await res.json());
}

testAuthSystem().catch(console.error);
