import express, { Request, Response, NextFunction, Router } from 'express';
import { todoStore } from './store';
import { CreateTodoInput, UpdateTodoInput, ApiError } from './types';

export const router: Router = express.Router();

// Validation helpers
function validateCreateInput(body: unknown): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }
  const input = body as Record<string, unknown>;
  if (typeof input.title !== 'string') {
    return { valid: false, error: 'Title is required and must be a string' };
  }
  if (input.title.trim().length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }
  return { valid: true };
}

function validateUpdateInput(body: unknown): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }
  const input = body as Record<string, unknown>;

  if (input.title !== undefined && typeof input.title !== 'string') {
    return { valid: false, error: 'Title must be a string' };
  }
  if (input.title !== undefined && input.title.trim().length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }
  if (input.completed !== undefined && typeof input.completed !== 'boolean') {
    return { valid: false, error: 'Completed must be a boolean' };
  }
  if (input.title === undefined && input.completed === undefined) {
    return { valid: false, error: 'At least one field (title or completed) must be provided' };
  }
  return { valid: true };
}

// Error response helper
function errorResponse(res: Response, status: number, error: string, message: string): void {
  res.status(status).json({ error, message } as ApiError);
}

// GET /todos - List all todos (excluding deleted)
router.get('/', (_req: Request, res: Response) => {
  const todos = todoStore.findAll();
  res.json(todos);
});

// GET /todos/:id - Get a single todo
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = todoStore.findById(id);

  if (!todo) {
    return errorResponse(res, 404, 'Not Found', 'Todo not found');
  }

  res.json(todo);
});

// POST /todos - Create a new todo
router.post('/', (req: Request, res: Response) => {
  const validation = validateCreateInput(req.body);
  if (!validation.valid) {
    return errorResponse(res, 400, 'Bad Request', validation.error!);
  }

  const input: CreateTodoInput = {
    title: (req.body as Record<string, unknown>).title as string,
  };

  try {
    const todo = todoStore.create(input);
    res.status(201).json(todo);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', 'Failed to create todo');
  }
});

// PUT /todos/:id - Update a todo
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const validation = validateUpdateInput(req.body);

  if (!validation.valid) {
    return errorResponse(res, 400, 'Bad Request', validation.error!);
  }

  const todo = todoStore.findById(id);
  if (!todo) {
    return errorResponse(res, 404, 'Not Found', 'Todo not found');
  }

  const input: UpdateTodoInput = {};
  const body = req.body as Record<string, unknown>;
  if (body.title !== undefined) {
    input.title = body.title as string;
  }
  if (body.completed !== undefined) {
    input.completed = body.completed as boolean;
  }

  try {
    const updated = todoStore.update(id, input);
    res.json(updated);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', 'Failed to update todo');
  }
});

// DELETE /todos/:id - Soft delete a todo
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = todoStore.softDelete(id);

  if (!deleted) {
    return errorResponse(res, 404, 'Not Found', 'Todo not found');
  }

  res.status(204).send();
});
