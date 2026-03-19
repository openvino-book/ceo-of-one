import express, { Express, Request, Response, NextFunction } from 'express';
import { createTodoRouter } from './routes';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json());

  // Routes
  app.use('/todos', createTodoRouter());

  // 404 handler for unknown routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', message: 'Route not found' });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
  });

  return app;
}

export function startServer(port: number = 3000): Express {
  const app = createApp();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  return app;
}

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}
