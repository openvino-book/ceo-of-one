import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types';

export class TodoStore {
  private todos: Map<string, Todo> = new Map();

  create(input: CreateTodoInput): Todo {
    const now = new Date();
    const todo: Todo = {
      id: uuidv4(),
      title: input.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  findById(id: string): Todo | null {
    const todo = this.todos.get(id);
    if (!todo || todo.deletedAt) {
      return null;
    }
    return todo;
  }

  findAll(): Todo[] {
    return Array.from(this.todos.values()).filter(todo => !todo.deletedAt);
  }

  update(id: string, input: UpdateTodoInput): Todo | null {
    const todo = this.todos.get(id);
    if (!todo || todo.deletedAt) {
      return null;
    }

    if (input.title !== undefined) {
      todo.title = input.title;
    }
    if (input.completed !== undefined) {
      todo.completed = input.completed;
    }
    todo.updatedAt = new Date();

    this.todos.set(id, todo);
    return todo;
  }

  softDelete(id: string): boolean {
    const todo = this.todos.get(id);
    if (!todo || todo.deletedAt) {
      return false;
    }
    todo.deletedAt = new Date();
    todo.updatedAt = new Date();
    this.todos.set(id, todo);
    return true;
  }

  clear(): void {
    this.todos.clear();
  }
}

export const todoStore = new TodoStore();
