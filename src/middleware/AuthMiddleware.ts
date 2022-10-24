import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction):any => {
    
    if(!req.headers.authorization){//if no token in header
        return res.status(200).json({
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": "token not found",
            "error_data": "token not found" 
        })
    }

    let secretKey = process.env.JWT_SECRET_KEY ||"default";
    const token:string = req.headers.authorization.split(" ")[1];

    try {
        const credential:string | object = jwt.verify(token, secretKey);

        if(credential){
            req.app.locals.credential = credential
            return next();
        }
    } catch (error) {
        return res.status(200).json({
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": "fail credential",
            "error_data": error 
        })
    }
}