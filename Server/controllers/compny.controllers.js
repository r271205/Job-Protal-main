
// Register the Company

import { Company } from '../models/Company.model.js'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import generateToken from "../utils/generateToeken.js";
import { Job } from '../models/Job.model.js';
import { JobAppliction } from '../models/JobAppliction.model.js';


export const registerCompany = async (req, res) => {

    const { name, email, password } = req.body;
    const imageFile = req.file;
    if (!name || !email || !password || !imageFile) {
        return res.json({
            success: false,
            message: "Missing Details"
        })
    }

    try {
        const companyExists = await Company.findOne({email});

        if(companyExists){
            return res.json({
                success: false,
                message: "Company is Already Exits "
            })
        }
        const hashpassword = await bcrypt.hash(password,10);
        
        const imageUpload = await cloudinary.uploader.upload(
            `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`
        );

        const company = await Company.create({
            name: name,
            email: email,
            password : hashpassword,
            image : imageUpload.secure_url
        })

        res.json({
            success : true,
            company :{
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token : generateToken(company._id)
        })
    } catch (error) {
        res.json({
            success: false,
            message : "This Error is try cathch Block"
        })
    }
}

// company login

export const loginCompany = async (req, res) => {

    const {email,password} = req.body;
    try {
        const company = await Company.findOne({email});

        if(!company){
            return res.json({
                success: false,
                message : "Email not registered"
            })
        }

        const iscorret = await bcrypt.compare(password,company.password);

        if(!iscorret){
            return res.json({
                success: false,
                message : "Invaild Email or Password "
            })
        }

        return res.json({
            success: true,
            company:{
                _id: company._id,
                name: company.name,
                email: company.email,
            },
            token: generateToken(company._id)
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Get company Data 

export const getCompanyData = async (req, res) => {
    try {
        const company = req.company;
        
        res.json({
            success: true,
            company 
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Post new Job

export const postJob = async (req, res) => {

    const {title,description,location,salary,level,category} = req.body

    const companyId = req.company._id

    try {
        const newJob = new Job({
            title: title,
            description: description,
            location: location,
            salary: salary,
            level: level,
            date: Date.now(),
            category: category,
            companyId: companyId
        })

        await newJob.save()

        res.json({
            success: true,
            message: "job is Added Successfully ",
            newJob
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// get Company job Applicants 

export const getCompanyjobApplicants = async (req, res) => {
    
    try {
        const companyId = req.company._id;
    
        // Find Job Appliction for The user and populate related data 
        const applications = await JobAppliction.find({companyId})
        .populate('userId', 'name image resume ')
        .populate('jobId', "title location category level salary")
        .exec();
    
        return res.json({
            success: true,
            applications 
        })
    
    } 
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Get Company Posted Job

export const getCompanyPostedjob = async (req, res) => {
    try {
        const companyid = req.company._id;
        const jobs = await Job.find({companyId:companyid});

        // Adding No Of job Appled User Count

        const jobData = await Promise.all(
        jobs.map(async (job) => {
            const applicantsCount = await JobAppliction.countDocuments({
            jobId: job._id,
            });

            return {
            ...job.toObject(),
            applicants: applicantsCount,
            };
        })
        );


        res.json({
            success: true,
            jobData: jobData 
        })
    } catch (error) {
        res.json({
            success: true,
            message: error.message
        })
    }
}


// Change Job Appliction Status 

export const changeJobAppliacationStatus = async (req, res) => {
    try {
        const {id,status} = req.body;
    
        await JobAppliction.findOneAndUpdate({_id:id},{status: status});
    
        res.json({
            success: true,
            message: "Staus is Changed"
        })
    } 
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Change Job Visiblity

export const changeJobVisiblity = async (req, res) => {
    try {
        const {id} = req.body;
        console.log({id})
        const companyId = req.company._id;
    
        const job = await Job.findById(id);
        
        if (!job) {
            return res.json({
                success: false,
                message: "Job not found"
            });
        }
        if(companyId.toString() === job.companyId.toString()){
            job.visible = !job.visible
        }
    
        await job.save();
    
        res.json({
            success: true,
            job,
            message: "Visibility changed Succefully"
        })
    } 
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}