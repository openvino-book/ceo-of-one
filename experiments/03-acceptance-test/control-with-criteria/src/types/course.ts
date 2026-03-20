export type Category = 'programming' | 'design' | 'business' | 'marketing';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: Category;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  instructor: string;
  price: number;
  category: Category;
  published?: boolean;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  instructor?: string;
  price?: number;
  category?: Category;
  published?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

export const VALID_CATEGORIES: Category[] = ['programming', 'design', 'business', 'marketing'];

export function validateCreateCourse(input: unknown): { valid: true; data: CreateCourseInput } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (typeof input !== 'object' || input === null) {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }] };
  }

  const body = input as Record<string, unknown>;

  // title validation
  if (body.title === undefined || body.title === null) {
    errors.push({ field: 'title', message: 'title is required' });
  } else if (typeof body.title !== 'string') {
    errors.push({ field: 'title', message: 'title must be a string' });
  } else if (body.title.trim() === '') {
    errors.push({ field: 'title', message: 'title must be a non-empty string' });
  }

  // instructor validation
  if (body.instructor === undefined || body.instructor === null) {
    errors.push({ field: 'instructor', message: 'instructor is required' });
  } else if (typeof body.instructor !== 'string') {
    errors.push({ field: 'instructor', message: 'instructor must be a string' });
  } else if (body.instructor.trim() === '') {
    errors.push({ field: 'instructor', message: 'instructor must be a non-empty string' });
  }

  // price validation
  if (body.price === undefined || body.price === null) {
    errors.push({ field: 'price', message: 'price is required' });
  } else if (typeof body.price !== 'number') {
    errors.push({ field: 'price', message: 'price must be a number' });
  } else if (body.price < 0) {
    errors.push({ field: 'price', message: 'price must be greater than or equal to 0' });
  }

  // category validation
  if (body.category === undefined || body.category === null) {
    errors.push({ field: 'category', message: 'category is required' });
  } else if (typeof body.category !== 'string') {
    errors.push({ field: 'category', message: 'category must be a string' });
  } else if (!VALID_CATEGORIES.includes(body.category as Category)) {
    errors.push({ field: 'category', message: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
  }

  // description validation (optional)
  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    errors.push({ field: 'description', message: 'description must be a string' });
  }

  // published validation (optional)
  if (body.published !== undefined && body.published !== null && typeof body.published !== 'boolean') {
    errors.push({ field: 'published', message: 'published must be a boolean' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title: body.title as string,
      description: body.description as string | undefined,
      instructor: body.instructor as string,
      price: body.price as number,
      category: body.category as Category,
      published: body.published as boolean | undefined
    }
  };
}

export function validateUpdateCourse(input: unknown): { valid: true; data: UpdateCourseInput } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (typeof input !== 'object' || input === null) {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }] };
  }

  const body = input as Record<string, unknown>;
  const data: UpdateCourseInput = {};

  // title validation (optional but must be valid if provided)
  if (body.title !== undefined) {
    if (typeof body.title !== 'string') {
      errors.push({ field: 'title', message: 'title must be a string' });
    } else if (body.title.trim() === '') {
      errors.push({ field: 'title', message: 'title must be a non-empty string' });
    } else {
      data.title = body.title;
    }
  }

  // instructor validation (optional but must be valid if provided)
  if (body.instructor !== undefined) {
    if (typeof body.instructor !== 'string') {
      errors.push({ field: 'instructor', message: 'instructor must be a string' });
    } else if (body.instructor.trim() === '') {
      errors.push({ field: 'instructor', message: 'instructor must be a non-empty string' });
    } else {
      data.instructor = body.instructor;
    }
  }

  // price validation (optional but must be valid if provided)
  if (body.price !== undefined) {
    if (typeof body.price !== 'number') {
      errors.push({ field: 'price', message: 'price must be a number' });
    } else if (body.price < 0) {
      errors.push({ field: 'price', message: 'price must be greater than or equal to 0' });
    } else {
      data.price = body.price;
    }
  }

  // category validation (optional but must be valid if provided)
  if (body.category !== undefined) {
    if (typeof body.category !== 'string') {
      errors.push({ field: 'category', message: 'category must be a string' });
    } else if (!VALID_CATEGORIES.includes(body.category as Category)) {
      errors.push({ field: 'category', message: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    } else {
      data.category = body.category as Category;
    }
  }

  // description validation (optional)
  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      errors.push({ field: 'description', message: 'description must be a string' });
    } else {
      data.description = body.description;
    }
  }

  // published validation (optional)
  if (body.published !== undefined) {
    if (typeof body.published !== 'boolean') {
      errors.push({ field: 'published', message: 'published must be a boolean' });
    } else {
      data.published = body.published;
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data };
}
