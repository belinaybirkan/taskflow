const service = require('../services/taskService');

exports.list = (req, res) => res.json(service.list(req.query));
exports.detail = (req, res) => res.json({ data: service.find(req.params.id) });
exports.create = (req, res) => res.status(201).json({
  message: 'Görev oluşturuldu.',
  data: service.create(req.body)
});
exports.update = (req, res) => res.json({
  message: 'Görev güncellendi.',
  data: service.update(req.params.id, req.body)
});
exports.remove = (req, res) => {
  service.remove(req.params.id);
  res.status(204).end();
};
