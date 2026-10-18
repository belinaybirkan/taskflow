const express = require('express');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.disable('x-powered-by');

app.use(logger);
app.use(express.json({ limit: '32kb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'TaskFlow API',
    endpoints: ['/health', '/tasks', '/projects', '/reports/summary']
  });
});
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TaskFlow' });
});

app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);
app.use('/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
