import request from 'supertest';
import { app } from '../src/app';
import { courseStore } from '../src/store/courseStore';

describe('Course API', () => {
  beforeEach(() => {
    courseStore.clear();
  });

  describe('POST /api/courses - Create Course', () => {
    const validCourse = {
      title: 'TypeScript Fundamentals',
      description: 'Learn TypeScript from scratch',
      instructor: 'John Doe',
      price: 99.99,
      category: 'programming'
    };

    it('should create a course with valid data and return 201', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send(validCourse)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(validCourse.title);
      expect(response.body.instructor).toBe(validCourse.instructor);
      expect(response.body.price).toBe(validCourse.price);
      expect(response.body.category).toBe(validCourse.category);
      expect(response.body.published).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 400 when title is empty', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({ ...validCourse, title: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.details).toHaveProperty('title');
      expect(response.body.details.title).toContain('title must be a non-empty string');
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({ ...validCourse, title: undefined })
        .expect(400);

      expect(response.body.details).toHaveProperty('title');
      expect(response.body.details.title).toContain('title is required');
    });

    it('should return 400 when instructor is empty', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({ ...validCourse, instructor: '' })
        .expect(400);

      expect(response.body.details).toHaveProperty('instructor');
      expect(response.body.details.instructor).toContain('instructor must be a non-empty string');
    });

    it('should return 400 when price is negative', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({ ...validCourse, price: -10 })
        .expect(400);

      expect(response.body.details).toHaveProperty('price');
      expect(response.body.details.price).toContain('price must be greater than or equal to 0');
    });

    it('should return 400 when category is invalid', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({ ...validCourse, category: 'invalid' })
        .expect(400);

      expect(response.body.details).toHaveProperty('category');
      expect(response.body.details.category).toContain('category must be one of: programming, design, business, marketing');
    });

    it('should return 400 with multiple validation errors', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({ title: '', instructor: '', price: -5, category: 'invalid' })
        .expect(400);

      expect(response.body.details).toHaveProperty('title');
      expect(response.body.details).toHaveProperty('instructor');
      expect(response.body.details).toHaveProperty('price');
      expect(response.body.details).toHaveProperty('category');
    });

    it('should allow creating a published course', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({ ...validCourse, published: true })
        .expect(201);

      expect(response.body.published).toBe(true);
    });
  });

  describe('GET /api/courses - List Courses', () => {
    beforeEach(async () => {
      // Create courses with slight delay to ensure different timestamps
      await request(app).post('/api/courses').send({
        title: 'Course 1',
        instructor: 'Instructor A',
        price: 50,
        category: 'programming',
        published: true
      });
      await new Promise(resolve => setTimeout(resolve, 10));
      await request(app).post('/api/courses').send({
        title: 'Course 2',
        instructor: 'Instructor B',
        price: 60,
        category: 'design',
        published: false
      });
      await new Promise(resolve => setTimeout(resolve, 10));
      await request(app).post('/api/courses').send({
        title: 'Course 3',
        instructor: 'Instructor C',
        price: 70,
        category: 'programming',
        published: true
      });
    });

    it('should return all courses sorted by createdAt descending', async () => {
      const response = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0].title).toBe('Course 3');
      expect(response.body[1].title).toBe('Course 2');
      expect(response.body[2].title).toBe('Course 1');
    });

    it('should filter courses by category', async () => {
      const response = await request(app)
        .get('/api/courses?category=programming')
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach((course: { category: string }) => {
        expect(course.category).toBe('programming');
      });
    });

    it('should filter courses by published=true', async () => {
      const response = await request(app)
        .get('/api/courses?published=true')
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach((course: { published: boolean }) => {
        expect(course.published).toBe(true);
      });
    });

    it('should filter courses by published=false', async () => {
      const response = await request(app)
        .get('/api/courses?published=false')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].published).toBe(false);
    });

    it('should combine category and published filters', async () => {
      const response = await request(app)
        .get('/api/courses?category=programming&published=true')
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach((course: { category: string; published: boolean }) => {
        expect(course.category).toBe('programming');
        expect(course.published).toBe(true);
      });
    });
  });

  describe('GET /api/courses/:id - Get Course by ID', () => {
    it('should return a course by ID', async () => {
      const createResponse = await request(app)
        .post('/api/courses')
        .send({
          title: 'Test Course',
          instructor: 'Test Instructor',
          price: 100,
          category: 'business'
        });

      const response = await request(app)
        .get(`/api/courses/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.title).toBe('Test Course');
    });

    it('should return 404 with JSON error body for non-existent ID', async () => {
      const response = await request(app)
        .get('/api/courses/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('PUT /api/courses/:id - Update Course', () => {
    it('should update an existing course and return 200', async () => {
      const createResponse = await request(app)
        .post('/api/courses')
        .send({
          title: 'Original Title',
          instructor: 'Original Instructor',
          price: 50,
          category: 'programming'
        });

      const response = await request(app)
        .put(`/api/courses/${createResponse.body.id}`)
        .send({ title: 'Updated Title', price: 99.99 })
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.price).toBe(99.99);
      expect(response.body.instructor).toBe('Original Instructor');
    });

    it('should return 404 for non-existent course', async () => {
      const response = await request(app)
        .put('/api/courses/non-existent-id')
        .send({ title: 'New Title' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Not Found');
    });

    it('should return 400 for invalid update data', async () => {
      const createResponse = await request(app)
        .post('/api/courses')
        .send({
          title: 'Test Course',
          instructor: 'Test Instructor',
          price: 50,
          category: 'programming'
        });

      const response = await request(app)
        .put(`/api/courses/${createResponse.body.id}`)
        .send({ price: -10 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.details).toHaveProperty('price');
    });
  });

  describe('DELETE /api/courses/:id - Delete Course', () => {
    it('should delete a course and return 204', async () => {
      const createResponse = await request(app)
        .post('/api/courses')
        .send({
          title: 'To Be Deleted',
          instructor: 'Instructor',
          price: 50,
          category: 'marketing'
        });

      await request(app)
        .delete(`/api/courses/${createResponse.body.id}`)
        .expect(204);
    });

    it('should return 404 when trying to get deleted course', async () => {
      const createResponse = await request(app)
        .post('/api/courses')
        .send({
          title: 'To Be Deleted',
          instructor: 'Instructor',
          price: 50,
          category: 'marketing'
        });

      await request(app)
        .delete(`/api/courses/${createResponse.body.id}`)
        .expect(204);

      await request(app)
        .get(`/api/courses/${createResponse.body.id}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent course', async () => {
      const response = await request(app)
        .delete('/api/courses/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Response Format', () => {
    it('should use { error, message, details } format for validation errors', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
      expect(typeof response.body.error).toBe('string');
      expect(typeof response.body.message).toBe('string');
      expect(typeof response.body.details).toBe('object');
    });

    it('should use { error, message } format for 404 errors', async () => {
      const response = await request(app)
        .get('/api/courses/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.error).toBe('string');
      expect(typeof response.body.message).toBe('string');
    });
  });
});
