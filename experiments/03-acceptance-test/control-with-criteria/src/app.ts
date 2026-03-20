import express from 'express';
import { courseRoutes } from './routes/courseRoutes';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/api/courses', courseRoutes);

  return app;
}

const app = createApp();
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    `Server running on port ${PORT}`;
  });
}

export { app };
