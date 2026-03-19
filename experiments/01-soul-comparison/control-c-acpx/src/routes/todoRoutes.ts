import { Router, Request, Response, NextFunction } from 'express';
import { TodoStore, todoStore } from '../store';
import { CreateTodoInput, UpdateTodoInput, TodoResponse } from '../types';

function toTodoResponse(todo: { id: string; title: string; completed: boolean; createdAt: Date; updatedAt: Date }): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}

function validateCreateInput(body: unknown): { valid: true; data: CreateTodoInput } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }
  const input = body as Record<string, unknown>;
  if (!input.title || typeof input.title !== 'string') {
    return { valid: false, error: 'Title is required and must be a non-empty string' };
  }
  if (input.title.trim().length === 0) {
    return { valid: false, error: 'Title cannot be empty or whitespace only' };
  }
  return { valid: true, data: { title: input.title.trim() } };
}

function validateUpdateInput(body: unknown): { valid: true; data: UpdateTodoInput } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }
  const input = body as Record<string, unknown>;
  const data: UpdateTodoInput = {};

  if (input.title !== undefined) {
    if (typeof input.title !== 'string') {
      return { valid: false, error: 'Title must be a string' };
    }
    if (input.title.trim().length === 0) {
      return { valid: false, error: 'Title cannot be empty or whitespace only' };
    }
    data.title = input.title.trim();
  }

  if (input.completed !== undefined) {
    if (typeof input.completed !== 'boolean') {
      return { valid: false, error: 'Completed must be a boolean' };
    }
    data.completed = input.completed;
  }

  if (Object.keys(data).length === 0) {
    return { valid: false, error: 'At least one field (title or completed) must be provided' };
  }

  return { valid: true, data };
}

export function createTodoRouter(store: TodoStore = todoStore): Router {
  const router = Router();

  // GET /todos - List all todos
  router.get('/', (req: Request, res: Response) => {
    const todos = store.findAll();
    res.json(todos.map(toTodoResponse));
  });

  // GET /todos/:id - Get a single todo
  router.get('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const todo = store.findById(id);

    if (!todo) {
      res.status(404).json({ error: 'Not Found', message: 'Todo not found' });
      return;
    }

    res.json(toTodoResponse(todo));
  });

  // POST /todos - Create a new todo
  router.post('/', (req: Request, res: Response) => {
    const validation = validateCreateInput(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: 'Bad Request', message: validation.error });
      return;
    }

    const todo = store.create(validation.data);
    res.status(201).json(toTodoResponse(todo));
  });

  // PUT /todos/:id - Update a todo
  router.put('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = validateUpdateInput(req.body);

    if (!validation.valid) {
      res.status(400).json({ error: 'Bad Request', message: validation.error });
      return;
    }

    const todo = store.update(id, validation.data);
    if (!todo) {
      res.status(404).json({ error: 'Not Found', message: 'Todo not found' });
      return;
    }

    res.json(toTodoResponse(todo));
  });

  // DELETE /todos/:id - Soft delete a todo
  router.delete('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = store.softDelete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Not Found', message: 'Todo not found' });
      return;
    }

    res.status(204).send();
  });

  return router;
}
