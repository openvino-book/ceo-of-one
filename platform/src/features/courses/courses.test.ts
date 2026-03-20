import { courseStore } from './store'
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  validateCreateCourse,
  validateUpdateCourse,
} from './service'

describe('Course Module', () => {
  beforeEach(() => {
    courseStore.clear()
  })

  describe('CourseStore', () => {
    it('should create a course with default values', () => {
      const course = courseStore.create({
        title: 'Test Course',
        instructor: 'Test Instructor',
        price: 99.99,
        category: 'programming',
      })

      expect(course.id).toBeDefined()
      expect(course.title).toBe('Test Course')
      expect(course.instructor).toBe('Test Instructor')
      expect(course.price).toBe(99.99)
      expect(course.category).toBe('programming')
      expect(course.published).toBe(false)
      expect(course.description).toBe('')
      expect(course.createdAt).toBeInstanceOf(Date)
      expect(course.updatedAt).toBeInstanceOf(Date)
    })

    it('should create a course with all fields', () => {
      const course = courseStore.create({
        title: 'Full Course',
        description: 'A complete course',
        instructor: 'Expert Instructor',
        price: 199.99,
        category: 'design',
        published: true,
      })

      expect(course.description).toBe('A complete course')
      expect(course.published).toBe(true)
    })

    it('should find course by id', () => {
      const created = courseStore.create({
        title: 'Find Me',
        instructor: 'Instructor',
        price: 50,
        category: 'business',
      })

      const found = courseStore.findById(created.id)
      expect(found).toEqual(created)
    })

    it('should return undefined for non-existent id', () => {
      const found = courseStore.findById('non-existent-id')
      expect(found).toBeUndefined()
    })

    it('should list all courses sorted by createdAt descending', async () => {
      const course1 = courseStore.create({
        title: 'First',
        instructor: 'A',
        price: 10,
        category: 'programming',
      })
      await new Promise(resolve => setTimeout(resolve, 10))
      const course2 = courseStore.create({
        title: 'Second',
        instructor: 'B',
        price: 20,
        category: 'programming',
      })
      await new Promise(resolve => setTimeout(resolve, 10))
      const course3 = courseStore.create({
        title: 'Third',
        instructor: 'C',
        price: 30,
        category: 'design',
      })

      const courses = courseStore.findAll()
      expect(courses).toHaveLength(3)
      expect(courses[0].id).toBe(course3.id)
      expect(courses[1].id).toBe(course2.id)
      expect(courses[2].id).toBe(course1.id)
    })

    it('should filter courses by category', () => {
      courseStore.create({
        title: 'Programming 1',
        instructor: 'A',
        price: 10,
        category: 'programming',
      })
      courseStore.create({
        title: 'Design 1',
        instructor: 'B',
        price: 20,
        category: 'design',
      })
      courseStore.create({
        title: 'Programming 2',
        instructor: 'C',
        price: 30,
        category: 'programming',
      })

      const programmingCourses = courseStore.findAll({ category: 'programming' })
      expect(programmingCourses).toHaveLength(2)
      programmingCourses.forEach(c => expect(c.category).toBe('programming'))

      const designCourses = courseStore.findAll({ category: 'design' })
      expect(designCourses).toHaveLength(1)
      expect(designCourses[0].category).toBe('design')
    })

    it('should filter courses by published status', () => {
      courseStore.create({
        title: 'Published 1',
        instructor: 'A',
        price: 10,
        category: 'programming',
        published: true,
      })
      courseStore.create({
        title: 'Unpublished 1',
        instructor: 'B',
        price: 20,
        category: 'programming',
        published: false,
      })
      courseStore.create({
        title: 'Published 2',
        instructor: 'C',
        price: 30,
        category: 'design',
        published: true,
      })

      const publishedCourses = courseStore.findAll({ published: true })
      expect(publishedCourses).toHaveLength(2)
      publishedCourses.forEach(c => expect(c.published).toBe(true))

      const unpublishedCourses = courseStore.findAll({ published: false })
      expect(unpublishedCourses).toHaveLength(1)
      expect(unpublishedCourses[0].published).toBe(false)
    })

    it('should combine filters', () => {
      courseStore.create({
        title: 'Published Programming',
        instructor: 'A',
        price: 10,
        category: 'programming',
        published: true,
      })
      courseStore.create({
        title: 'Unpublished Programming',
        instructor: 'B',
        price: 20,
        category: 'programming',
        published: false,
      })
      courseStore.create({
        title: 'Published Design',
        instructor: 'C',
        price: 30,
        category: 'design',
        published: true,
      })

      const filtered = courseStore.findAll({ category: 'programming', published: true })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].title).toBe('Published Programming')
    })

    it('should update a course', () => {
      const course = courseStore.create({
        title: 'Original',
        instructor: 'Original Instructor',
        price: 50,
        category: 'programming',
      })

      const updated = courseStore.update(course.id, {
        title: 'Updated',
        price: 99.99,
      })

      expect(updated).toBeDefined()
      expect(updated!.title).toBe('Updated')
      expect(updated!.price).toBe(99.99)
      expect(updated!.instructor).toBe('Original Instructor')
      expect(updated!.category).toBe('programming')
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(course.createdAt.getTime())
    })

    it('should return undefined when updating non-existent course', () => {
      const updated = courseStore.update('non-existent', { title: 'New Title' })
      expect(updated).toBeUndefined()
    })

    it('should delete a course', () => {
      const course = courseStore.create({
        title: 'To Delete',
        instructor: 'Instructor',
        price: 50,
        category: 'programming',
      })

      const deleted = courseStore.delete(course.id)
      expect(deleted).toBe(true)

      const found = courseStore.findById(course.id)
      expect(found).toBeUndefined()
    })

    it('should return false when deleting non-existent course', () => {
      const deleted = courseStore.delete('non-existent')
      expect(deleted).toBe(false)
    })

    it('should clear all courses', () => {
      courseStore.create({
        title: 'Course 1',
        instructor: 'A',
        price: 10,
        category: 'programming',
      })
      courseStore.create({
        title: 'Course 2',
        instructor: 'B',
        price: 20,
        category: 'design',
      })

      courseStore.clear()
      expect(courseStore.findAll()).toHaveLength(0)
    })
  })

  describe('validateCreateCourse', () => {
    it('should validate valid input', () => {
      const result = validateCreateCourse({
        title: 'Valid Course',
        instructor: 'Valid Instructor',
        price: 99.99,
        category: 'programming',
      })

      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(result.data.title).toBe('Valid Course')
        expect(result.data.instructor).toBe('Valid Instructor')
        expect(result.data.price).toBe(99.99)
        expect(result.data.category).toBe('programming')
      }
    })

    it('should fail when title is missing', () => {
      const result = validateCreateCourse({
        instructor: 'Instructor',
        price: 99.99,
        category: 'programming',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const titleErrors = result.errors.filter(e => e.field === 'title')
        expect(titleErrors.length).toBeGreaterThan(0)
        expect(titleErrors[0].message).toContain('required')
      }
    })

    it('should fail when title is empty', () => {
      const result = validateCreateCourse({
        title: '',
        instructor: 'Instructor',
        price: 99.99,
        category: 'programming',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const titleErrors = result.errors.filter(e => e.field === 'title')
        expect(titleErrors.length).toBeGreaterThan(0)
        expect(titleErrors[0].message).toContain('non-empty')
      }
    })

    it('should fail when price is negative', () => {
      const result = validateCreateCourse({
        title: 'Course',
        instructor: 'Instructor',
        price: -10,
        category: 'programming',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const priceErrors = result.errors.filter(e => e.field === 'price')
        expect(priceErrors.length).toBeGreaterThan(0)
        expect(priceErrors[0].message).toContain('greater than or equal to 0')
      }
    })

    it('should fail when category is invalid', () => {
      const result = validateCreateCourse({
        title: 'Course',
        instructor: 'Instructor',
        price: 99.99,
        category: 'invalid',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const categoryErrors = result.errors.filter(e => e.field === 'category')
        expect(categoryErrors.length).toBeGreaterThan(0)
        expect(categoryErrors[0].message).toContain('programming, design, business, marketing')
      }
    })

    it('should return multiple validation errors', () => {
      const result = validateCreateCourse({
        title: '',
        instructor: '',
        price: -5,
        category: 'invalid',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.errors.length).toBe(4)
        expect(result.errors.map(e => e.field)).toContain('title')
        expect(result.errors.map(e => e.field)).toContain('instructor')
        expect(result.errors.map(e => e.field)).toContain('price')
        expect(result.errors.map(e => e.field)).toContain('category')
      }
    })
  })

  describe('validateUpdateCourse', () => {
    it('should validate partial update', () => {
      const result = validateUpdateCourse({ title: 'New Title' })

      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(result.data.title).toBe('New Title')
        expect(result.data.instructor).toBeUndefined()
        expect(result.data.price).toBeUndefined()
      }
    })

    it('should fail when title is empty', () => {
      const result = validateUpdateCourse({ title: '' })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const titleErrors = result.errors.filter(e => e.field === 'title')
        expect(titleErrors.length).toBeGreaterThan(0)
        expect(titleErrors[0].message).toContain('non-empty')
      }
    })

    it('should fail when price is negative', () => {
      const result = validateUpdateCourse({ price: -10 })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const priceErrors = result.errors.filter(e => e.field === 'price')
        expect(priceErrors.length).toBeGreaterThan(0)
        expect(priceErrors[0].message).toContain('greater than or equal to 0')
      }
    })

    it('should allow empty update', () => {
      const result = validateUpdateCourse({})

      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(Object.keys(result.data)).toHaveLength(0)
      }
    })
  })

  describe('Service Functions', () => {
    it('should create course via service', () => {
      const result = createCourse({
        title: 'Service Course',
        instructor: 'Service Instructor',
        price: 149.99,
        category: 'business',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.course.title).toBe('Service Course')
        expect(result.course.id).toBeDefined()
      }
    })

    it('should return errors for invalid create input', () => {
      const result = createCourse({
        title: '',
        instructor: '',
        price: -10,
        category: 'invalid',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toBeDefined()
        expect(result.errors.title).toBeDefined()
        expect(result.errors.instructor).toBeDefined()
        expect(result.errors.price).toBeDefined()
        expect(result.errors.category).toBeDefined()
      }
    })

    it('should list courses via service', () => {
      createCourse({
        title: 'Course 1',
        instructor: 'A',
        price: 10,
        category: 'programming',
      })
      createCourse({
        title: 'Course 2',
        instructor: 'B',
        price: 20,
        category: 'design',
      })

      const courses = listCourses()
      expect(courses.length).toBeGreaterThanOrEqual(2)
    })

    it('should filter courses via service', () => {
      courseStore.clear()
      createCourse({
        title: 'Programming Course',
        instructor: 'A',
        price: 10,
        category: 'programming',
        published: true,
      })
      createCourse({
        title: 'Design Course',
        instructor: 'B',
        price: 20,
        category: 'design',
        published: false,
      })

      const programmingCourses = listCourses({ category: 'programming' })
      expect(programmingCourses).toHaveLength(1)
      expect(programmingCourses[0].category).toBe('programming')

      const publishedCourses = listCourses({ published: true })
      expect(publishedCourses).toHaveLength(1)
      expect(publishedCourses[0].published).toBe(true)
    })

    it('should get course by id via service', () => {
      const createResult = createCourse({
        title: 'Get Me',
        instructor: 'Instructor',
        price: 50,
        category: 'marketing',
      })

      if (createResult.success) {
        const result = getCourse(createResult.course.id)
        expect('id' in result).toBe(true)
        if ('id' in result) {
          expect(result.title).toBe('Get Me')
        }
      }
    })

    it('should return error for non-existent course', () => {
      const result = getCourse('non-existent-id')

      expect('success' in result && result.success === false).toBe(true)
      if ('success' in result && !result.success) {
        expect(result.error).toBe('Not Found')
        expect(result.message).toContain('non-existent-id')
      }
    })

    it('should update course via service', () => {
      const createResult = createCourse({
        title: 'Original',
        instructor: 'Original Instructor',
        price: 50,
        category: 'programming',
      })

      if (createResult.success) {
        const updateResult = updateCourse(createResult.course.id, {
          title: 'Updated',
          price: 99.99,
        })

        expect(updateResult.success).toBe(true)
        if (updateResult.success) {
          expect(updateResult.course.title).toBe('Updated')
          expect(updateResult.course.price).toBe(99.99)
          expect(updateResult.course.instructor).toBe('Original Instructor')
        }
      }
    })

    it('should return error when updating non-existent course', () => {
      const result = updateCourse('non-existent-id', { title: 'New Title' })

      expect('success' in result && result.success === false).toBe(true)
      if ('success' in result && !result.success && 'error' in result) {
        expect(result.error).toBe('Not Found')
      }
    })

    it('should return errors for invalid update input', () => {
      const createResult = createCourse({
        title: 'Course',
        instructor: 'Instructor',
        price: 50,
        category: 'programming',
      })

      if (createResult.success) {
        const updateResult = updateCourse(createResult.course.id, {
          price: -10,
        })

        expect(updateResult.success).toBe(false)
        if (!updateResult.success && 'errors' in updateResult) {
          expect(updateResult.errors.price).toBeDefined()
        }
      }
    })

    it('should delete course via service', () => {
      const createResult = createCourse({
        title: 'To Delete',
        instructor: 'Instructor',
        price: 50,
        category: 'marketing',
      })

      if (createResult.success) {
        const deleteResult = deleteCourse(createResult.course.id)
        expect(deleteResult).toBe(true)

        const getResult = getCourse(createResult.course.id)
        expect('success' in getResult && getResult.success === false).toBe(true)
      }
    })

    it('should return error when deleting non-existent course', () => {
      const result = deleteCourse('non-existent-id')

      expect(result).not.toBe(true)
      if (result !== true) {
        expect(result.error).toBe('Not Found')
      }
    })
  })
})
