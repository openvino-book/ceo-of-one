import express from 'express';
import coursesRouter from './routes/courses';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/api/courses', coursesRouter);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

export default createApp;
