import { Job } from "../models/Job.model.js";
import { JobAppliction } from "../models/JobAppliction.model.js";
import { User } from "../models/User.model.js";
import {v2 as cloudinary } from 'cloudinary'

// Get User Data

export const getUserData = async(req,res) =>{
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
    
        if(!user){
            return res.json({
                success : false,
                message: "User Not Found"
            });
        }
    
        res.json({
            success : true,
            user
        });

    } 
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Apply For Job 

export const applyForJob = async(req,res) =>{

    try {
        const {jobId} = req.body;
    
        const { userId } = req.auth();
    
        // User Have Already Apply This Job 
       const isAlreadyApplied = await JobAppliction.findOne({ userId, jobId });
    
        if(isAlreadyApplied){
            return res.json({
                success: false,
                message: " Already Applied "
            })
        }
    
        const jobData = await Job.findById(jobId);
    
        if(!jobData){
            return res.json({
                success: false,
                message: "Job Not Found"
            })
        }
    
        await JobAppliction.create({
            companyId : jobData.companyId,
            jobId : jobId,
            userId : userId,
            date: Date.now()
        })
    
        res.json({
            success: true,
            message: "Applied Successfully "
        })

    } 
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Get User Applied Appliction

export const getJobApplictions = async(req,res) =>{

    try {
        const { userId } = req.auth();
    
        const applications = await JobAppliction.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title descripation category location level salary')
        .exec()
    
        if(!applications){
            return res.json({
                success: false,
                message: "Not job applications found for this user "
            })
        }
    
        res.json({
            success: true,
            applications 
        })
    } 
    catch (error) {
        res.json({
            success: true,
            message: error.message
        })
    }
}

// update User Profile (resume)

export const updateUserProfile = async(req,res) =>{

    try {
        
        const { userId } = req.auth();
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        
        const resumeFile = req.file;
        
        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if(resumeFile){
           const resumeUplode = await cloudinary.uploader.upload(
            `data:${resumeFile.mimetype};base64,${resumeFile.buffer.toString("base64")}`
        );
            userData.resume = resumeUplode.secure_url;
        }
        
        await userData.save();

        res.json({
            success: true,
            message: "Resume is Uplode"
        })
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}