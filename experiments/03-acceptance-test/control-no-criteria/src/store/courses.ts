import { Course, CreateCourseInput, UpdateCourseInput } from '../types/course';
import { randomUUID } from 'crypto';

// In-memory storage for courses
const courses: Map<string, Course> = new Map();

export function getAllCourses(): Course[] {
  return Array.from(courses.values());
}

export function getCourseById(id: string): Course | undefined {
  return courses.get(id);
}

export function createCourse(input: CreateCourseInput): Course {
  const now = new Date();
  const course: Course = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    instructor: input.instructor,
    price: input.price,
    category: input.category,
    published: input.published ?? false,
    createdAt: now,
    updatedAt: now,
  };
  courses.set(course.id, course);
  return course;
}

export function updateCourse(id: string, input: UpdateCourseInput): Course | undefined {
  const existingCourse = courses.get(id);
  if (!existingCourse) {
    return undefined;
  }

  const updatedCourse: Course = {
    ...existingCourse,
    ...input,
    id: existingCourse.id,
    createdAt: existingCourse.createdAt,
    updatedAt: new Date(),
  };
  courses.set(id, updatedCourse);
  return updatedCourse;
}

export function deleteCourse(id: string): boolean {
  return courses.delete(id);
}

export function clearAllCourses(): void {
  courses.clear();
}
