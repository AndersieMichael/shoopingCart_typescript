import { Request, Response, } from "express";
import Icontroller from "./ControllerInterface";
import CustomerServices from "../services/CustomerServices";
import Authentication from "../utlilities/Password";
import { sequelize } from "../db/models";
import MyResponse from "../response/Responses";


class CustomerController implements Icontroller{
    
    getAll = async (req: Request, res: Response): Promise<Response> => {

        const service:CustomerServices = new CustomerServices(req);
        const getAll = await service.getAll();

        const result = MyResponse.Success_showData(getAll);

        return res.status(200).json(result);
    }

    getById = async (req: Request, res: Response): Promise<Response> => {

        const service:CustomerServices = new CustomerServices(req);
        const getbyID = await service.getByID();
        
        // console.log(result);
        
        if(getbyID==null){//data not found
        
            let message:string = "user not found"
            let data:string = "user not found"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        const result = MyResponse.Success_showData(getbyID);

        return res.status(200).json(result);
    }

    create = async (req: Request, res: Response): Promise<Response> => {

        const t = await sequelize.transaction();

        const service:CustomerServices = new CustomerServices(req);

        const username = req.body["username"];
        const password = req.body["password"];

        const checking = await service.checkUsername();
        // console.log(checking);
        
        if(checking!=null){//data found

            let message:string = "username already taken for: " + username.toString()
            let data:string = "Username duplicate" 
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);

        }

        const hashed:string = await Authentication.passwordHash(password);

        const create = await service.create(hashed,t);

        if(create.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(create);
            return res.status(200).json(result);
        }

        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);
    }
    
    update = async (req: Request, res: Response): Promise<Response> => {

        const t = await sequelize.transaction();

        const service:CustomerServices = new CustomerServices(req);
        const username = req.body["username"];
        const password = req.body["password"];

        const check_id = await service.getByID();
        
        if(check_id==null){//data not found
            let message:string = "user not found" 
            let data:string = "user not found" 
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        const checking = await service.checkUsername();
        
        if(checking!=null){//data found
            let message:string = "username already taken for: " + username.toString()
            let data:string = "Username duplicate" 
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        const hashed:string = await Authentication.passwordHash(password);

        const update = await service.update(hashed,t);
        if(update.errors!=null){
            
            await t.rollback();
            const result:object = MyResponse.error_param(update);
            return res.status(200).json(result);
        }
        
        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);
    }

    delete = async (req: Request, res: Response): Promise<Response> => {

        const t = await sequelize.transaction();
        
        const service:CustomerServices = new CustomerServices(req);

        const check_id = await service.getByID();
        
        if(check_id==null){//data not found
            let message:string = "user not found" 
            let data:string = "user not found" 
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        const delete_data = await service.delete(t);
        if(delete_data.errors!=null){
            
            await t.rollback();
            const result:object = MyResponse.error_param(delete_data);
            return res.status(200).json(result);
        }

        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);
    }
    
}

export default new CustomerController();