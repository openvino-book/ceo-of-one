import { Router } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from './todoController';

const router = Router();

// GET /api/todos
router.get('/', getAllTodos);

// GET /api/todos/:id
router.get('/:id', getTodoById);

// POST /api/todos
router.post('/', createTodo);

// PUT /api/todos/:id
router.put('/:id', updateTodo);

// DELETE /api/todos/:id
router.delete('/:id', deleteTodo);

export default router;
