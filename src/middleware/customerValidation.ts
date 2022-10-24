import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate = (req:Request, res:Response, next:NextFunction) =>{
        let validation = Joi.object({
            "name": Joi.string().required(),
            "phone": Joi.string().required(),
            "username": Joi.string().required(),
            "password":Joi.string().required(),
        }).required();

        let joi_body_validation = validation.validate(req.body);

        if(joi_body_validation.error){
            return res.status(422).send(joi_body_validation.error);
        }

        return next();
    }



export default validate;
