import express from 'express'
import { changeJobAppliacationStatus, changeJobVisiblity, getCompanyData, getCompanyjobApplicants, getCompanyPostedjob, loginCompany, postJob, registerCompany } from '../controllers/compny.controllers.js';
import upload from '../config/multer.js';
import { verifyJwt } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register the Company

router.post('/register',upload.single('image'),registerCompany);

// company login

router.post('/login',loginCompany);

// get data company 

router.get('/getdata',verifyJwt,getCompanyData);

// Post Job

router.post('/post-job',verifyJwt,postJob);

// Get Appliction Data of Company 

router.get('/applicants',verifyJwt,getCompanyjobApplicants);

// Get Company job list

router.get('/list-job',verifyJwt,getCompanyPostedjob);

// Change Job Appliction Status

router.post('/change-status',verifyJwt,changeJobAppliacationStatus);

// Change Job Visiblity

router.post('/change-visiblity',verifyJwt,changeJobVisiblity);

export default router;