import express from 'express';
import { applyForJob, getJobApplictions, getUserData, updateUserProfile } from '../controllers/usre.controllers.js';
import upload from '../config/multer.js';

const router = express.Router();

// Get user Data route
router.get('/getuserdata',getUserData);

//Apply For job route 
router.post('/apply-job',applyForJob);

// Get User Applied Appliction route
router.get('/application',getJobApplictions);

// update user Resume route
router.post('/update-resume',upload.single('resume'),updateUserProfile);

export default router;