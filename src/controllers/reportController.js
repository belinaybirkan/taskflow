const taskService = require('../services/taskService');
const projectService = require('../services/projectService');

exports.summary = (_req, res) => res.json({
  data: {
    totalProjects: projectService.list().length,
    ...taskService.summary()
  }
});
