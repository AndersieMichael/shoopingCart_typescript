import { Request, Response } from "express";
import MyResponse from "../response/Responses";
import CustomerServices from "../services/CustomerServices";
import Authentication from "../utlilities/Password";

class AuthenticationController {

    login = async (req: Request, res: Response): Promise<Response> => {

        
        const password = req.body["password"];

        const service:CustomerServices = new CustomerServices(req);
        const checkUser = await service.checkUsername();
        // console.log(result);
        // console.log(result["dataValues"]);
        // console.log(result["dataValues"]["id"]);
        
        let compare:boolean;
        let token;
        if(checkUser!=null){//user found
            
            compare = await Authentication.passwordCompare(password,checkUser["dataValues"]["password"]);
            
        }else{
            let message:string = "username or password invalid" 
            let data:string = "Username not found" 
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);

        }

        if(compare){
            token = Authentication.generateToken(checkUser["dataValues"]["id"],checkUser["dataValues"]["username"],checkUser["dataValues"]["password"]);
        }else{
            let message:string = "username or password invalid" 
            let data:string =  "password failed" 
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }
        
        const result = MyResponse.Success_showData(token);

        return res.status(200).json(result);

    }
}

export default new AuthenticationController();