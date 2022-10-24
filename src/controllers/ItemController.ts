import { Request, Response } from "express";
import Icontroller from "./ControllerInterface";
import ItemServices from "../services/ItemServices";
import { sequelize } from "../db/models";
import MyResponse from "../response/Responses";

class ItemController implements Icontroller{

    getAll= async (req: Request, res: Response): Promise<Response> => {

        const service:ItemServices = new ItemServices(req);
        const getAll = await service.getAll();

        const result = MyResponse.Success_showData(getAll);

        return res.status(200).json(result);
    
    }

    getById= async(req: Request, res: Response): Promise<Response> =>{ 
        
        const service:ItemServices = new ItemServices(req);
        const getByID = await service.getByID();
        // console.log(result);
        
        if(getByID==undefined){//data kosong
            let message:string = "ID not found"
            let data:string = "ID not found"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        const result = MyResponse.Success_showData(getByID);

        return res.status(200).json(result);
    }

    create = async(req: Request, res: Response): Promise<Response> =>{

        const t = await sequelize.transaction();
        
        const service:ItemServices = new ItemServices(req);

        const checking = await service.checkingName();

        // console.log(checking);
        
        if(checking!=null){
            let message:string = "name already registered (duplicate)"
            let data:any = checking["name"]
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
    
        }

        const create = await service.create(t);
        // console.log(result);

        if(create.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(create);
            return res.status(200).json(result);
        }

        
        let item_id = create["item_id"];
        // console.log(item_id);
        
        const addCatalogue = await service.addItemCatalogue(item_id,t);
        if(addCatalogue.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(addCatalogue);
            return res.status(200).json(result);
        }

        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);
    }

    update = async(req: Request, res: Response): Promise<Response> =>{

        const t = await sequelize.transaction();

        const service:ItemServices = new ItemServices(req);

        const checkingID = await service.getByID();
        // console.log(checkingID);
        
        if(checkingID==null){
            let message:string = "ID not found"
            let data:string = "ID not found"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);

        }

        const checkingName = await service.checkingName();

        if(checkingName!=null){//data found
            let message:string ="name already registered "
            let data:string = checkingName["name"]
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
            
        }

        const update = await service.update(t);
        if(update.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(update);
            return res.status(200).json(result);
        }

        const updateCatalogue = await service.updateItemCatalogue(t);
        if(updateCatalogue.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(updateCatalogue);
            return res.status(200).json(result);
        }
        
        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);
    }

    delete= async(req: Request, res: Response): Promise<Response> =>{

        const t = await sequelize.transaction();
        
        const service:ItemServices = new ItemServices(req);

        const checkingID = await service.getByID();

        if(checkingID==null){
            let message:string = "ID not found"
            let data:string = "ID not found"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        const deleteCatalogue = await service.deleteItemCatalogue(t);
        if(deleteCatalogue.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(deleteCatalogue);
            return res.status(200).json(result);
        }

        const deleteItem = await service.delete(t);
        if(deleteItem.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(deleteItem);
            return res.status(200).json(result);
        }

        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);

    }

}

export default new ItemController();