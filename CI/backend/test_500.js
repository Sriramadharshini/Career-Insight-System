async function testEndpoints() {
  let token = '';
  try {
    const loginRes = await fetch('http://localhost:5002/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@careerinsight.com', password: 'Admin@123' })
    });
    
    if (!loginRes.ok) {
      console.log('Login failed', loginRes.status);
      return;
    }
    const data = await loginRes.json();
    token = data.token;
    console.log('Login successful');
  } catch (e) {
    console.log('Login error:', e.message);
    return;
  }

  const endpoints = [
    { method: 'GET', url: '/auth/me' },
    { method: 'GET', url: '/admin/dashboard/stats' },
    { method: 'GET', url: '/admin/settings' },
    { method: 'GET', url: '/admin/analytics/overview' },
    { method: 'GET', url: '/admin/dashboard/recent-users' },
    { method: 'GET', url: '/admin/dashboard/recent-activity' },
    { method: 'GET', url: '/admin/analytics/comprehensive?period=monthly' }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`http://localhost:5002/api${ep.url}`, {
        method: ep.method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`${ep.method} ${ep.url} -> ${res.status}`);
      if (res.status === 500) {
        const data = await res.json();
        console.log('Error data:', data);
      }
    } catch (e) {
      console.log(`${ep.method} ${ep.url} -> Error:`, e.message);
    }
  }
}

testEndpoints();
