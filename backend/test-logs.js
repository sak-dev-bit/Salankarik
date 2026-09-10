
async function run() {
  try {
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@salankarik.test', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.access_token;
    
    console.log('Testing PATCH /discounts (trigger interceptor)');
    const updateRes = await fetch('http://localhost:3000/discounts/92aa7d0e-fe1e-42b4-b304-5c92da2fccf8', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ value: 25 }) // Just modifying the discount to trigger the interceptor
    });
    await updateRes.json();

    // wait a moment for the async interceptor to save
    await new Promise(r => setTimeout(r, 1000));

    console.log('Testing GET /activity-logs');
    const logsRes = await fetch('http://localhost:3000/activity-logs', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log(await logsRes.json());
    
  } catch(e) {
    console.error(e);
  }
}
run();
