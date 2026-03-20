import { v4 as uuidv4 } from 'uuid'
import { Course, CreateCourseInput, UpdateCourseInput, CourseFilters } from './types'

class CourseStore {
  private courses: Map<string, Course> = new Map()

  create(input: CreateCourseInput): Course {
    const now = new Date()
    const course: Course = {
      id: uuidv4(),
      title: input.title,
      description: input.description ?? '',
      instructor: input.instructor,
      price: input.price,
      category: input.category,
      published: input.published ?? false,
      createdAt: now,
      updatedAt: now,
    }
    this.courses.set(course.id, course)
    return course
  }

  findById(id: string): Course | undefined {
    return this.courses.get(id)
  }

  findAll(filters?: CourseFilters): Course[] {
    let courses = Array.from(this.courses.values())

    if (filters?.category !== undefined) {
      courses = courses.filter((c) => c.category === filters.category)
    }

    if (filters?.published !== undefined) {
      courses = courses.filter((c) => c.published === filters.published)
    }

    courses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return courses
  }

  update(id: string, input: UpdateCourseInput): Course | undefined {
    const course = this.courses.get(id)
    if (!course) {
      return undefined
    }

    const updatedCourse: Course = {
      ...course,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.instructor !== undefined && { instructor: input.instructor }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.published !== undefined && { published: input.published }),
      updatedAt: new Date(),
    }

    this.courses.set(id, updatedCourse)
    return updatedCourse
  }

  delete(id: string): boolean {
    return this.courses.delete(id)
  }

  clear(): void {
    this.courses.clear()
  }
}

export const courseStore = new CourseStore()
