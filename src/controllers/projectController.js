const service = require('../services/projectService');

exports.list = (_req, res) => res.json({ data: service.list() });
exports.detail = (req, res) => res.json({ data: service.find(req.params.id) });
exports.create = (req, res) => res.status(201).json({
  message: 'Proje oluşturuldu.',
  data: service.create(req.body)
});
exports.update = (req, res) => res.json({
  message: 'Proje güncellendi.',
  data: service.update(req.params.id, req.body)
});
exports.remove = (req, res) => {
  service.remove(req.params.id);
  res.status(204).end();
};
