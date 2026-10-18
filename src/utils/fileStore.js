const fs = require('node:fs');
const path = require('node:path');

function getPath(collection) {
  if (!['tasks', 'projects'].includes(collection)) {
    throw new Error('Bilinmeyen koleksiyon.');
  }
  const dir = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(__dirname, '..', 'data');
  return path.join(dir, collection + '.json');
}

function read(collection) {
  const file = getPath(collection);
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf8').trim();
  if (!raw) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error(collection + '.json liste içermeli.');
  return data;
}

function write(collection, rows) {
  const target = getPath(collection);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temp = target + '.' + process.pid + '.tmp';
  try {
    fs.writeFileSync(temp, JSON.stringify(rows, null, 2) + '\n', 'utf8');
    fs.renameSync(temp, target);
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}

module.exports = { read, write };
