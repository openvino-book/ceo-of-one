import { Router, Request, Response } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../store/courses';
import { CreateCourseInput, UpdateCourseInput } from '../types/course';

const router = Router();

// GET /api/courses - List all courses
router.get('/', (req: Request, res: Response) => {
  const courses = getAllCourses();
  res.json(courses);
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const course = getCourseById(id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json(course);
});

// POST /api/courses - Create a new course
router.post('/', (req: Request, res: Response) => {
  const { title, description, instructor, price, category, published } = req.body;

  if (!title || !description || !instructor || price === undefined || !category) {
    return res.status(400).json({
      error: 'Missing required fields: title, description, instructor, price, category',
    });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price must be a non-negative number' });
  }

  const input: CreateCourseInput = {
    title,
    description,
    instructor,
    price,
    category,
    published,
  };

  const course = createCourse(input);
  res.status(201).json(course);
});

// PUT /api/courses/:id - Update a course
router.put('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { title, description, instructor, price, category, published } = req.body;

  const input: UpdateCourseInput = {};
  if (title !== undefined) input.title = title;
  if (description !== undefined) input.description = description;
  if (instructor !== undefined) input.instructor = instructor;
  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }
    input.price = price;
  }
  if (category !== undefined) input.category = category;
  if (published !== undefined) input.published = published;

  const course = updateCourse(id, input);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json(course);
});

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = deleteCourse(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.status(204).send();
});

export default router;
