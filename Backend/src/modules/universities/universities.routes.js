import { Router } from 'express';
import * as universityController from './universities.controller.js';

const router = Router();

router.get('/', universityController.getAllUniversities);
router.get('/compare', universityController.compareUniversities);
router.get('/:code', universityController.getUniversityByCode);

export default router;

