import request from 'supertest';
import { app } from '../src/index';
import { todoStore } from '../src/store';

// Helper to get a valid UUID format for testing
const invalidId = 'invalid-uuid';
const nonExistentId = '12345678-1234-1234-1234-123456789012';

describe('Todo API', () => {
  beforeEach(() => {
    // Clear the store before each test
    todoStore.clear();
  });

  describe('POST /todos', () => {
    it('should create a new todo with required fields', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: 'Test Todo' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(response.body.title).toBe('Test Todo');
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.deleted).toBe(false);
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/todos')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('Title is required');
    });

    it('should return 400 when title is not a string', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: 123 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('Title is required and must be a string');
    });

    it('should return 400 when title is empty', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('Title cannot be empty');
    });

    it('should return 400 when body is not valid JSON', async () => {
      const response = await request(app)
        .post('/todos')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      // Express default JSON parser returns 400 for invalid JSON
      expect(response.status).toBe(400);
    });
  });

  describe('GET /todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all non-deleted todos', async () => {
      // Create some todos
      await request(app).post('/todos').send({ title: 'Todo 1' });
      await request(app).post('/todos').send({ title: 'Todo 2' });
      await request(app).post('/todos').send({ title: 'Todo 3' });

      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body.map((t: any) => t.title)).toEqual(
        expect.arrayContaining(['Todo 1', 'Todo 2', 'Todo 3'])
      );
    });

    it('should not return soft-deleted todos', async () => {
      // Create todos
      const createRes = await request(app).post('/todos').send({ title: 'Todo 1' });
      await request(app).post('/todos').send({ title: 'Todo 2' });

      // Delete one
      await request(app).delete(`/todos/${createRes.body.id}`).expect(204);

      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Todo 2');
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a single todo by id', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test Todo' });

      const response = await request(app)
        .get(`/todos/${createRes.body.id}`)
        .expect(200);

      expect(response.body.title).toBe('Test Todo');
      expect(response.body.id).toBe(createRes.body.id);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get(`/todos/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body.message).toContain('not found');
    });

    it('should return 404 for soft-deleted todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'To Delete' });

      await request(app)
        .delete(`/todos/${createRes.body.id}`)
        .expect(204);

      const response = await request(app)
        .get(`/todos/${createRes.body.id}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update todo title', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Original Title' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.completed).toBe(false);
    });

    it('should update todo completed status', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test Todo' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body.completed).toBe(true);
      expect(response.body.title).toBe('Test Todo');
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

    it('should update updatedAt timestamp', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const originalUpdatedAt = createRes.body.updatedAt;

      // Small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: 'Updated' })
        .expect(200);

      expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime()
      );
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put(`/todos/${nonExistentId}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });

    it('should return 400 when no fields provided', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('At least one field');
    });

    it('should return 400 when title is not a string', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: 123 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('Title must be a string');
    });

    it('should return 400 when completed is not a boolean', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ completed: 'yes' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('Completed must be a boolean');
    });

    it('should return 400 when title is empty', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test' });

      const response = await request(app)
        .put(`/todos/${createRes.body.id}`)
        .send({ title: '   ' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('Title cannot be empty');
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

      // Verify it's no longer in the list
      const listRes = await request(app).get('/todos');
      expect(listRes.body).toHaveLength(0);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete(`/todos/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });

    it('should return 404 when trying to delete already deleted todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'To Delete' });

      await request(app)
        .delete(`/todos/${createRes.body.id}`)
        .expect(204);

      const response = await request(app)
        .delete(`/todos/${createRes.body.id}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
