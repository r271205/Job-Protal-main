import jwt from 'jsonwebtoken';
import { Company } from '../models/Company.model.js'

export const verifyJwt = async(req,res,next) => {
    const token = req.headers.token

    if(!token){
        return res.json({
            success: false,
            message: 'Not Authorized,Login Again'
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const company = await 
        Company.findById(decoded.id)
                .select('-password');

        if(!company){
            // Todo : 
            return res.json({
                success: false,
                message: "Invaild Access Token"
            });
        }

        req.company = company;
        next()
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}