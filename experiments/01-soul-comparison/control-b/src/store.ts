import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoInput, UpdateTodoInput } from './types';

class TodoStore {
  private todos: Map<string, Todo> = new Map();

  create(input: CreateTodoInput): Todo {
    const now = new Date();
    const todo: Todo = {
      id: uuidv4(),
      title: input.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  findAll(excludeDeleted: boolean = true): Todo[] {
    const allTodos = Array.from(this.todos.values());
    if (excludeDeleted) {
      return allTodos.filter(todo => !todo.deleted);
    }
    return allTodos;
  }

  findById(id: string, excludeDeleted: boolean = true): Todo | undefined {
    const todo = this.todos.get(id);
    if (!todo) return undefined;
    if (excludeDeleted && todo.deleted) return undefined;
    return todo;
  }

  update(id: string, input: UpdateTodoInput): Todo | undefined {
    const todo = this.findById(id);
    if (!todo) return undefined;

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
    if (!todo || todo.deleted) return false;

    todo.deleted = true;
    todo.updatedAt = new Date();
    this.todos.set(id, todo);
    return true;
  }

  clear(): void {
    this.todos.clear();
  }
}

export const todoStore = new TodoStore();
