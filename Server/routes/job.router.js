import express from 'express'
import { getjobById, getjobs } from '../controllers/job.controller.js'

const router = express.Router()

// Get Onlt Single Job by Id
router.get('/:id',getjobById);

// Get All Job

router.get('/',getjobs);

export default router;