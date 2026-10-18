// Önce ayrı terminalde "npm start" çalıştır.
const base = process.env.BASE_URL || 'http://localhost:3000';

async function request(method, route, body) {
  const response = await fetch(base + route, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  return { status: response.status, json };
}

async function main() {
  let createdId;
  try {
    const health = await request('GET', '/health');
    if (health.status !== 200) throw new Error('Health testi başarısız.');
    const projects = await request('GET', '/projects');
    if (projects.status !== 200 || !projects.json.data.length) {
      throw new Error('Örnek proje bulunamadı.');
    }

    const created = await request('POST', '/tasks', {
      title: 'HTTP test görevi', description: 'CRUD kontrolleri',
      assignee: 'Ece', priority: 'high', projectId: projects.json.data[0].id
    });
    if (created.status !== 201) throw new Error('POST: ' + created.status);
    createdId = created.json.data.id;

    const all = await request('GET', '/tasks');
    if (all.status !== 200 || !all.json.data.some(x => x.id === createdId)) {
      throw new Error('GET liste başarısız.');
    }
    const detail = await request('GET', '/tasks/' + createdId);
    if (detail.status !== 200) throw new Error('GET detay başarısız.');
    const updated = await request('PUT', '/tasks/' + createdId, { status: 'completed' });
    if (updated.status !== 200 || updated.json.data.status !== 'completed') {
      throw new Error('PUT başarısız.');
    }
    const deleted = await request('DELETE', '/tasks/' + createdId);
    if (deleted.status !== 204) throw new Error('DELETE başarısız.');
    createdId = null;
    const missing = await request('GET', '/tasks/' + detail.json.data.id);
    if (missing.status !== 404) throw new Error('404 kontrolü başarısız.');
    console.log('HTTP CRUD testleri başarılı (201, 200, 200, 200, 204, 404).');
  } finally {
    if (createdId) await request('DELETE', '/tasks/' + createdId);
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
