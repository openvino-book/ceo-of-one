import { Request, Response } from 'express';
import { Todo, CreateTodoDto, UpdateTodoDto } from './types';

// In-memory storage
let todos: Todo[] = [];

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// GET /api/todos - Get all todos
export const getAllTodos = (req: Request, res: Response): void => {
  res.json(todos);
};

// GET /api/todos/:id - Get todo by ID
export const getTodoById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  res.json(todo);
};

// POST /api/todos - Create new todo
export const createTodo = (req: Request, res: Response): void => {
  const { title }: CreateTodoDto = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const now = new Date();
  const newTodo: Todo = {
    id: generateId(),
    title,
    completed: false,
    createdAt: now,
    updatedAt: now
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
};

// PUT /api/todos/:id - Update todo
export const updateTodo = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { title, completed }: UpdateTodoDto = req.body;

  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  const updatedTodo: Todo = {
    ...todos[todoIndex],
    ...(title !== undefined && { title }),
    ...(completed !== undefined && { completed }),
    updatedAt: new Date()
  };

  todos[todoIndex] = updatedTodo;
  res.json(updatedTodo);
};

// DELETE /api/todos/:id - Delete todo
export const deleteTodo = (req: Request, res: Response): void => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  todos = todos.filter(t => t.id !== id);
  res.status(204).send();
};
