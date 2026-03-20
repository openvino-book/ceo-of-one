import { Request, Response } from 'express';
import { courseStore } from '../store/courseStore';
import { validateCreateCourse, validateUpdateCourse, Category, ErrorResponse } from '../types/course';

function buildErrorResponse(error: string, message: string, details?: Record<string, string[]>): ErrorResponse {
  const response: ErrorResponse = { error, message };
  if (details) {
    response.details = details;
  }
  return response;
}

function formatValidationErrors(errors: Array<{ field: string; message: string }>): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const error of errors) {
    if (!details[error.field]) {
      details[error.field] = [];
    }
    details[error.field].push(error.message);
  }
  return details;
}

export const courseController = {
  listCourses: (req: Request, res: Response): void => {
    const category = req.query.category as Category | undefined;
    const publishedParam = req.query.published;

    let published: boolean | undefined;
    if (publishedParam === 'true') {
      published = true;
    } else if (publishedParam === 'false') {
      published = false;
    }

    const courses = courseStore.findAll({ category, published });
    res.json(courses);
  },

  getCourse: (req: Request, res: Response): void => {
    const { id } = req.params;
    const course = courseStore.findById(id);

    if (!course) {
      res.status(404).json(buildErrorResponse('Not Found', `Course with ID ${id} not found`));
      return;
    }

    res.json(course);
  },

  createCourse: (req: Request, res: Response): void => {
    const validation = validateCreateCourse(req.body);

    if (!validation.valid) {
      const details = formatValidationErrors(validation.errors);
      res.status(400).json(buildErrorResponse('Validation Error', 'Invalid input data', details));
      return;
    }

    const course = courseStore.create(validation.data);
    res.status(201).json(course);
  },

  updateCourse: (req: Request, res: Response): void => {
    const { id } = req.params;

    const existingCourse = courseStore.findById(id);
    if (!existingCourse) {
      res.status(404).json(buildErrorResponse('Not Found', `Course with ID ${id} not found`));
      return;
    }

    const validation = validateUpdateCourse(req.body);
    if (!validation.valid) {
      const details = formatValidationErrors(validation.errors);
      res.status(400).json(buildErrorResponse('Validation Error', 'Invalid input data', details));
      return;
    }

    const updatedCourse = courseStore.update(id, validation.data);
    res.status(200).json(updatedCourse);
  },

  deleteCourse: (req: Request, res: Response): void => {
    const { id } = req.params;
    const deleted = courseStore.delete(id);

    if (!deleted) {
      res.status(404).json(buildErrorResponse('Not Found', `Course with ID ${id} not found`));
      return;
    }

    res.status(204).send();
  }
};
