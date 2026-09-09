
async function run() {
  try {
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@salankarik.test', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.access_token;
    
    console.log('Testing GET /customers');
    const custRes = await fetch('http://localhost:3000/customers', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const customers = await custRes.json();
    console.log(customers);
    
    const customerId = customers.data[0].id;
    console.log('Testing GET /customers/:id with ID:', customerId);
    
    const detRes = await fetch(`http://localhost:3000/customers/${customerId}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log(await detRes.json());
    
  } catch(e) {
    console.error(e);
  }
}
run();
