import { Router } from 'express';
import { courseController } from '../controllers/courseController';

const router = Router();

router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourse);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

export { router as courseRoutes };
