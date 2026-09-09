
async function run() {
  try {
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@salankarik.test', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.access_token;
    
    console.log('Testing GET /orders');
    const ordersRes = await fetch('http://localhost:3000/orders', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const orders = await ordersRes.json();
    console.log('Orders Total:', orders.total);
    console.log('Sample Order:', orders.data[0]);
    
    const orderId = orders.data[0].id;
    console.log('\nTesting GET /orders/:id with ID:', orderId);
    
    const detRes = await fetch(`http://localhost:3000/orders/${orderId}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log(await detRes.json());

    console.log('\nTesting PATCH /orders/:id/status');
    const updateRes = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ status: 'processing' })
    });
    console.log(await updateRes.json());
    
  } catch(e) {
    console.error(e);
  }
}
run();
