const store = require('../utils/fileStore');
const HttpError = require('../utils/HttpError');
const { toId } = require('./taskService');

const editable = ['name', 'description', 'status'];
const statuses = ['active', 'completed', 'on-hold'];

function validate(input, partial = false) {
  if (!input || Array.isArray(input) || typeof input !== 'object') {
    throw new HttpError(400, 'JSON nesnesi gönderilmeli.');
  }
  const keys = Object.keys(input);
  if (partial && !keys.length) throw new HttpError(400, 'Güncellenecek alan gerekli.');
  for (const key of keys) {
    if (!editable.includes(key)) throw new HttpError(400, 'Bilinmeyen alan: ' + key);
  }
  if (!partial && (!input.name || typeof input.name !== 'string')) {
    throw new HttpError(400, 'name zorunlu.');
  }
  for (const key of ['name', 'description']) {
    if (input[key] !== undefined &&
        (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > 500)) {
      throw new HttpError(400, key + ' geçerli metin olmalı.');
    }
  }
  if (input.status !== undefined && !statuses.includes(input.status)) {
    throw new HttpError(400, 'Proje durumu geçersiz.');
  }
}

function list() { return store.read('projects'); }

function find(id) {
  const key = toId(id);
  const project = list().find(item => item.id === key);
  if (!project) throw new HttpError(404, 'Proje bulunamadı.');
  return project;
}

function create(input) {
  validate(input);
  const projects = list();
  const now = new Date().toISOString();
  const project = {
    id: Math.max(0, ...projects.map(p => p.id)) + 1,
    name: input.name.trim(),
    description: input.description ? input.description.trim() : '',
    status: input.status || 'active',
    createdAt: now,
    updatedAt: now
  };
  store.write('projects', [...projects, project]);
  return project;
}

function update(id, input) {
  validate(input, true);
  const previous = find(id);
  const next = { ...previous };
  for (const key of editable) {
    if (Object.hasOwn(input, key)) next[key] =
      ['name', 'description'].includes(key) ? input[key].trim() : input[key];
  }
  next.updatedAt = new Date().toISOString();
  store.write('projects', list().map(p => p.id === previous.id ? next : p));
  return next;
}

function remove(id) {
  const current = find(id);
  if (store.read('tasks').some(task => task.projectId === current.id)) {
    throw new HttpError(409, 'Bu projeye bağlı görevler var. Önce görevleri taşıyın veya silin.');
  }
  store.write('projects', list().filter(p => p.id !== current.id));
}

module.exports = { list, find, create, update, remove, validate };
