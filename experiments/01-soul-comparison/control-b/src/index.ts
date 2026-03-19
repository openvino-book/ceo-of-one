import express, { Express, Request, Response, NextFunction } from 'express';
import { router as todoRouter } from './routes';

const app: Express = express();

// Middleware
app.use(express.json());

// Routes
app.use('/todos', todoRouter);

// 404 handler for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Route not found',
  });
});

// Error handler
app.use((err: Error & { status?: number; statusCode?: number; type?: string }, _req: Request, res: Response, _next: NextFunction) => {
  // Handle body-parser errors (invalid JSON, etc.)
  if (err.type === 'entity.parse.failed' || err.status === 400 || err.statusCode === 400) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON in request body',
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});

// Export app for testing
export { app };

// Start server if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
