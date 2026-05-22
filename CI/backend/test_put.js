async function testPut() {
  try {
    const loginRes = await fetch('http://localhost:5002/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@careerinsight.com', password: 'Admin@123' })
    });
    
    const data = await loginRes.json();
    const token = data.token;
    
    const res = await fetch('http://localhost:5002/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ aiEnabled: false })
    });
    
    console.log(`PUT /admin/settings -> ${res.status}`);
    if (res.status === 500) {
      const errData = await res.json();
      console.log('Error data:', errData);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
testPut();
