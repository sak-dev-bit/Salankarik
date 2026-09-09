

async function run() {
  try {
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@salankarik.test', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.access_token;
    
    console.log('Testing GET /inventory');
    const invRes = await fetch('http://localhost:3000/inventory', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log(await invRes.json());
    
    // Adjust stock for product 687d7a25-d3a0-49a8-ab25-d582092774ff (Gold Ring created previously)
    console.log('Testing PATCH /inventory/:productId');
    const patchRes = await fetch('http://localhost:3000/inventory/687d7a25-d3a0-49a8-ab25-d582092774ff', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ change_qty: 10, reason: 'Initial restock' })
    });
    console.log(await patchRes.json());
    
    console.log('Testing GET /inventory/history');
    const histRes = await fetch('http://localhost:3000/inventory/history?product_id=687d7a25-d3a0-49a8-ab25-d582092774ff', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log(await histRes.json());
    
  } catch(e) {
    console.error(e);
  }
}
run();
