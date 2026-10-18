const store = require('../utils/fileStore');
const HttpError = require('../utils/HttpError');

const statuses = ['pending', 'in-progress', 'completed'];
const priorities = ['low', 'medium', 'high'];
const editable = ['title', 'description', 'assignee', 'status', 'priority', 'projectId'];

function toId(value) {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1) {
    throw new HttpError(400, 'ID pozitif tam sayı olmalı.');
  }
  return n;
}

function ensureProject(projectId) {
  const id = toId(projectId);
  if (!store.read('projects').some(p => p.id === id)) {
    throw new HttpError(400, 'Belirtilen proje bulunamadı.');
  }
  return id;
}

function validate(input, partial = false) {
  if (!input || Array.isArray(input) || typeof input !== 'object') {
    throw new HttpError(400, 'JSON nesnesi göndermelisiniz.');
  }
  const keys = Object.keys(input);
  if (partial && keys.length === 0) {
    throw new HttpError(400, 'Güncellenecek en az bir alan gerekli.');
  }
  for (const key of keys) {
    if (!editable.includes(key)) throw new HttpError(400, 'Bilinmeyen alan: ' + key);
  }
  if (!partial) {
    for (const field of ['title', 'description', 'assignee', 'priority', 'projectId']) {
      if (input[field] === undefined) throw new HttpError(400, field + ' zorunlu.');
    }
  }
  for (const field of ['title', 'description', 'assignee']) {
    if (input[field] !== undefined &&
        (typeof input[field] !== 'string' || !input[field].trim() || input[field].length > 500)) {
      throw new HttpError(400, field + ' boş olmayan en fazla 500 karakterlik metin olmalı.');
    }
  }
  if (input.status !== undefined && !statuses.includes(input.status)) {
    throw new HttpError(400, 'Durum: pending, in-progress veya completed olmalı.');
  }
  if (input.priority !== undefined && !priorities.includes(input.priority)) {
    throw new HttpError(400, 'Öncelik: low, medium veya high olmalı.');
  }
  if (input.projectId !== undefined) ensureProject(input.projectId);
}

function list(query = {}) {
  let rows = store.read('tasks');
  for (const field of ['status', 'priority', 'assignee', 'projectId']) {
    if (query[field] === undefined) continue;
    if (field === 'projectId') {
      const id = toId(query[field]);
      rows = rows.filter(task => task.projectId === id);
    } else {
      const value = String(query[field]).trim().toLocaleLowerCase('tr');
      if (!value) throw new HttpError(400, field + ' filtresi boş olamaz.');
      if (field === 'status' && !statuses.includes(query[field])) throw new HttpError(400, 'Geçersiz durum filtresi.');
      if (field === 'priority' && !priorities.includes(query[field])) throw new HttpError(400, 'Geçersiz öncelik filtresi.');
      rows = rows.filter(task => task[field].toLocaleLowerCase('tr') === value);
    }
  }
  if (query.q !== undefined) {
    const keyword = String(query.q).trim().toLocaleLowerCase('tr');
    if (!keyword) throw new HttpError(400, 'Arama terimi boş olamaz.');
    rows = rows.filter(task => [task.title, task.description, task.assignee]
      .some(value => value.toLocaleLowerCase('tr').includes(keyword)));
  }
  const total = rows.length;
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);
  if (!Number.isSafeInteger(page) || page < 1 ||
      !Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(400, 'page pozitif sayı, limit 1-100 arasında olmalı.');
  }
  rows = [...rows].sort((a, b) => b.id - a.id);
  return {
    data: rows.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

function find(id) {
  const key = toId(id);
  const task = store.read('tasks').find(item => item.id === key);
  if (!task) throw new HttpError(404, 'Görev bulunamadı.');
  return task;
}

function create(input) {
  validate(input);
  const rows = store.read('tasks');
  const now = new Date().toISOString();
  const task = {
    id: Math.max(0, ...rows.map(row => row.id)) + 1,
    title: input.title.trim(),
    description: input.description.trim(),
    assignee: input.assignee.trim(),
    status: input.status || 'pending',
    priority: input.priority,
    projectId: Number(input.projectId),
    createdAt: now,
    updatedAt: now
  };
  store.write('tasks', [...rows, task]);
  return task;
}

function update(id, input) {
  validate(input, true);
  const current = find(id);
  const next = { ...current };
  for (const key of editable) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      next[key] = ['title', 'description', 'assignee'].includes(key)
        ? input[key].trim()
        : key === 'projectId' ? Number(input[key]) : input[key];
    }
  }
  next.updatedAt = new Date().toISOString();
  store.write('tasks', store.read('tasks').map(task => task.id === current.id ? next : task));
  return next;
}

function remove(id) {
  const current = find(id);
  store.write('tasks', store.read('tasks').filter(task => task.id !== current.id));
}

function summary() {
  const tasks = store.read('tasks');
  const byStatus = Object.fromEntries(statuses.map(x => [x, 0]));
  const byPriority = Object.fromEntries(priorities.map(x => [x, 0]));
  for (const task of tasks) {
    if (Object.hasOwn(byStatus, task.status)) byStatus[task.status]++;
    if (Object.hasOwn(byPriority, task.priority)) byPriority[task.priority]++;
  }
  return { totalTasks: tasks.length, byStatus, byPriority };
}

module.exports = { list, find, create, update, remove, summary, validate, toId };
