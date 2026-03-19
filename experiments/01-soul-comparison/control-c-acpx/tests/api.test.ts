import request from 'supertest';
import express, { Express, Request, Response } from 'express';
import { createApp } from '../src/index';
import { TodoStore } from '../src/store';
import { createTodoRouter } from '../src/routes';

describe('Todo API', () => {
  let app: Express;
  let store: TodoStore;

  beforeEach(() => {
    store = new TodoStore();
    // Create app with fresh store for each test
    app = express();
    app.use(express.json());
    app.use('/todos', createTodoRouter(store));
    // 404 handler for unknown routes
    app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Not Found', message: 'Route not found' });
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: 'Test Todo' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Todo');
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should trim whitespace from title', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: '  Trimmed Todo  ' })
        .expect(201);

      expect(response.body.title).toBe('Trimmed Todo');
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/todos')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Title is required');
    });

    it('should return 400 when title is empty string', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: '' })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Title is required');
    });

    it('should return 400 when title is only whitespace', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Title cannot be empty');
    });

    it('should return 400 when title is not a string', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: 123 })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Title is required');
    });

    it('should return 400 when body is not an object', async () => {
      const response = await request(app)
        .post('/todos')
        .send('not json')
        .expect(400);
    });
  });

  describe('GET /todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all todos', async () => {
      await request(app).post('/todos').send({ title: 'Todo 1' });
      await request(app).post('/todos').send({ title: 'Todo 2' });

      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Todo 1');
      expect(response.body[1].title).toBe('Todo 2');
    });

    it('should not return soft-deleted todos', async () => {
      await request(app).post('/todos').send({ title: 'Todo 1' });
      const createRes = await request(app).post('/todos').send({ title: 'Todo 2' });
      await request(app).delete(`/todos/${createRes.body.id}`);

      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Todo 1');
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a single todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test Todo' });

      const response = await request(app)
        .get(`/todos/${createRes.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(createRes.body.id);
      expect(response.body.title).toBe('Test Todo');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get('/todos/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toBe('Todo not found');
    });

    it('should return 404 for soft-deleted todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'To Delete' });

      await request(app).delete(`/todos/${createRes.body.id}`);

      const response = await request(app)
        .get(`/todos/${createRes.body.id}`)
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update todo title', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Original' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: 'Updated' })
        .expect(200);

      expect(response.body.title).toBe('Updated');
    });

    it('should update todo completed status', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it('should update both title and completed', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Original' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: 'Updated', completed: true })
        .expect(200);

      expect(response.body.title).toBe('Updated');
      expect(response.body.completed).toBe(true);
    });

    it('should trim title whitespace', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Original' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: '  Trimmed  ' })
        .expect(200);

      expect(response.body.title).toBe('Trimmed');
    });

    it('should return 400 when no fields provided', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('At least one field');
    });

    it('should return 400 when title is empty string', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: '' })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Title cannot be empty');
    });

    it('should return 400 when completed is not boolean', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ completed: 'yes' })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Completed must be a boolean');
    });

    it('should return 400 when title is not a string', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: 123 })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Title must be a string');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/todos/non-existent-id')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });

    it('should return 404 for soft-deleted todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'To Delete' });

      await request(app).delete(`/todos/${createRes.body.id}`);

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });

    it('should update updatedAt timestamp', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ completed: true })
        .expect(200);

      expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(
        new Date(createRes.body.updatedAt).getTime()
      );
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should soft delete a todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'To Delete' });

      await request(app)
        .delete(`/todos/${createRes.body.id}`)
        .expect(204);

      // Verify it's no longer returned
      const response = await request(app)
        .get(`/todos/${createRes.body.id}`)
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete('/todos/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });

    it('should return 404 for already deleted todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'To Delete' });

      await request(app).delete(`/todos/${createRes.body.id}`);

      const response = await request(app)
        .delete(`/todos/${createRes.body.id}`)
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('404 for unknown routes', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });
  });
});
