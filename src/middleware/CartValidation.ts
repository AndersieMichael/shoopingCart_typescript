import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const Cartvalidate = (req:Request, res:Response, next:NextFunction) =>{
        let validation = Joi.object({
            "item_id": Joi.number().required(), 
            "total": Joi.number().required(),
        }).required();

        let joi_body_validation = validation.validate(req.body);

        if(joi_body_validation.error){
            return res.status(422).send(joi_body_validation.error);
        }

        return next();
    }



export default Cartvalidate;
