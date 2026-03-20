import request from 'supertest';
import createApp from './app';
import { clearAllCourses } from './store/courses';

const app = createApp();

describe('Course API', () => {
  beforeEach(() => {
    clearAllCourses();
  });

  describe('GET /api/courses', () => {
    it('should return an empty array when no courses exist', async () => {
      const res = await request(app).get('/api/courses');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all courses', async () => {
      // Create two courses
      await request(app).post('/api/courses').send({
        title: 'Course 1',
        description: 'Description 1',
        instructor: 'Instructor 1',
        price: 99.99,
        category: 'Programming',
      });
      await request(app).post('/api/courses').send({
        title: 'Course 2',
        description: 'Description 2',
        instructor: 'Instructor 2',
        price: 149.99,
        category: 'Design',
      });

      const res = await request(app).get('/api/courses');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should return a course by ID', async () => {
      const createRes = await request(app).post('/api/courses').send({
        title: 'Test Course',
        description: 'Test Description',
        instructor: 'Test Instructor',
        price: 99.99,
        category: 'Programming',
      });

      const res = await request(app).get(`/api/courses/${createRes.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Course');
      expect(res.body.description).toBe('Test Description');
      expect(res.body.instructor).toBe('Test Instructor');
      expect(res.body.price).toBe(99.99);
      expect(res.body.category).toBe('Programming');
      expect(res.body.published).toBe(false);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app).get('/api/courses/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Course not found');
    });
  });

  describe('POST /api/courses', () => {
    it('should create a new course with all fields', async () => {
      const res = await request(app).post('/api/courses').send({
        title: 'New Course',
        description: 'New Description',
        instructor: 'New Instructor',
        price: 199.99,
        category: 'Data Science',
        published: true,
      });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Course');
      expect(res.body.description).toBe('New Description');
      expect(res.body.instructor).toBe('New Instructor');
      expect(res.body.price).toBe(199.99);
      expect(res.body.category).toBe('Data Science');
      expect(res.body.published).toBe(true);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
    });

    it('should create a course with published defaulting to false', async () => {
      const res = await request(app).post('/api/courses').send({
        title: 'Unpublished Course',
        description: 'Description',
        instructor: 'Instructor',
        price: 50,
        category: 'Marketing',
      });

      expect(res.status).toBe(201);
      expect(res.body.published).toBe(false);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app).post('/api/courses').send({
        title: 'Incomplete Course',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for invalid price', async () => {
      const res = await request(app).post('/api/courses').send({
        title: 'Course',
        description: 'Description',
        instructor: 'Instructor',
        price: -10,
        category: 'Programming',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Price must be a non-negative number');
    });

    it('should return 400 for non-number price', async () => {
      const res = await request(app).post('/api/courses').send({
        title: 'Course',
        description: 'Description',
        instructor: 'Instructor',
        price: 'free',
        category: 'Programming',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Price must be a non-negative number');
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update an existing course', async () => {
      const createRes = await request(app).post('/api/courses').send({
        title: 'Original Title',
        description: 'Original Description',
        instructor: 'Original Instructor',
        price: 100,
        category: 'Programming',
      });

      const res = await request(app)
        .put(`/api/courses/${createRes.body.id}`)
        .send({
          title: 'Updated Title',
          price: 200,
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.price).toBe(200);
      expect(res.body.description).toBe('Original Description');
      expect(res.body.instructor).toBe('Original Instructor');
      expect(res.body.category).toBe('Programming');
    });

    it('should update published status', async () => {
      const createRes = await request(app).post('/api/courses').send({
        title: 'Course',
        description: 'Description',
        instructor: 'Instructor',
        price: 100,
        category: 'Programming',
      });

      expect(createRes.body.published).toBe(false);

      const res = await request(app)
        .put(`/api/courses/${createRes.body.id}`)
        .send({ published: true });

      expect(res.status).toBe(200);
      expect(res.body.published).toBe(true);
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app).put('/api/courses/non-existent-id').send({
        title: 'Updated Title',
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Course not found');
    });

    it('should return 400 for invalid price', async () => {
      const createRes = await request(app).post('/api/courses').send({
        title: 'Course',
        description: 'Description',
        instructor: 'Instructor',
        price: 100,
        category: 'Programming',
      });

      const res = await request(app)
        .put(`/api/courses/${createRes.body.id}`)
        .send({ price: -50 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Price must be a non-negative number');
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should delete an existing course', async () => {
      const createRes = await request(app).post('/api/courses').send({
        title: 'Course to Delete',
        description: 'Description',
        instructor: 'Instructor',
        price: 100,
        category: 'Programming',
      });

      const deleteRes = await request(app).delete(
        `/api/courses/${createRes.body.id}`
      );
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(
        `/api/courses/${createRes.body.id}`
      );
      expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app).delete('/api/courses/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Course not found');
    });
  });

  describe('Health check', () => {
    it('should return ok status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });
});
