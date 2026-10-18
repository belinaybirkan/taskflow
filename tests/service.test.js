const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const task = require('../src/services/taskService');
const project = require('../src/services/projectService');

const originalDataDir = process.env.DATA_DIR;
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'taskflow-test-'));

function reset() {
  fs.writeFileSync(path.join(temp, 'projects.json'), JSON.stringify([
    { id: 1, name: 'Demo', description: '', status: 'active' }
  ]));
  fs.writeFileSync(path.join(temp, 'tasks.json'), JSON.stringify([]));
}

process.env.DATA_DIR = temp;
test.after(() => {
  if (originalDataDir === undefined) delete process.env.DATA_DIR;
  else process.env.DATA_DIR = originalDataDir;
  fs.rmSync(temp, { recursive: true, force: true });
});

test('görev oluşturma, listeleme ve detay', () => {
  reset();
  const created = task.create({
    title: ' API testleri ', description: 'Postman ile dene',
    assignee: 'Ece', priority: 'high', projectId: 1
  });
  assert.equal(created.id, 1);
  assert.equal(created.title, 'API testleri');
  assert.equal(created.status, 'pending');
  assert.equal(task.list().data.length, 1);
  assert.equal(task.find(created.id).assignee, 'Ece');
});

test('güncelleme, filtreleme ve silme', () => {
  reset();
  const created = task.create({
    title: 'Listeleme', description: 'Liste testi',
    assignee: 'Ayşe', priority: 'medium', projectId: 1
  });
  const changed = task.update(created.id, { status: 'completed', priority: 'low' });
  assert.equal(changed.status, 'completed');
  assert.equal(task.list({ status: 'completed' }).pagination.total, 1);
  assert.equal(task.summary().byStatus.completed, 1);
  task.remove(created.id);
  assert.equal(task.list().data.length, 0);
  assert.throws(() => task.find(created.id), { status: 404 });
});

test('geçersiz alan ve eksik proje engellenir', () => {
  reset();
  assert.throws(() => task.create({
    title: 'Deneme', description: 'Test', assignee: 'Mert', priority: 'high', projectId: 999
  }), { status: 400 });
  assert.throws(() => task.create({
    title: '', description: 'Test', assignee: 'Mert', priority: 'high', projectId: 1
  }), { status: 400 });
});

test('proje oluşturma, güncelleme, silme', () => {
  reset();
  const created = project.create({ name: 'Mobil Uygulama', description: 'Yeni uygulama' });
  assert.equal(created.id, 2);
  assert.equal(project.update(created.id, { status: 'on-hold' }).status, 'on-hold');
  project.remove(created.id);
  assert.equal(project.list().length, 1);
});

test('bağlı görevi bulunan proje silinemez', () => {
  reset();
  task.create({
    title: 'Bağlantı', description: 'İlişki testi', assignee: 'Ece', priority: 'low', projectId: 1
  });
  assert.throws(() => project.remove(1), { status: 409 });
});

test('sayfalama sonuçları doğru hesaplar', () => {
  reset();
  for (let i = 0; i < 4; i++) {
    task.create({
      title: 'İş ' + i, description: 'Test açıklaması', assignee: 'Ece',
      priority: 'low', projectId: 1
    });
  }
  const result = task.list({ page: '2', limit: '2' });
  assert.equal(result.data.length, 2);
  assert.equal(result.pagination.total, 4);
  assert.equal(result.pagination.totalPages, 2);
});
