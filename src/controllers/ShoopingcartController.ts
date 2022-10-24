import { Request, Response } from "express";
import Icontroller from "./ControllerInterface";
import ItemServices from "../services/ItemServices";
import CartService from "../services/ShoopingCartServices";
import { sequelize } from "../db/models";
import MyResponse from "../response/Responses";

class ItemController implements Icontroller{

    getAll= async (req: Request, res: Response): Promise<Response> => {

        const service:CartService = new CartService(req);
        const getAll = await service.getAll();

        const result = MyResponse.Success_showData(getAll);

        return res.status(200).json(result);
    
    }

    //must login
    getById= async(req: Request, res: Response): Promise<Response> =>{ 
        
        const service:CartService = new CartService(req);
        const getByID = await service.getByID();

        if(getByID==null){//data kosong
            let message:string = "doesn't have shoopingcart"
            let data:string = "doesn't have shoopingcart"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        const result = MyResponse.Success_showData(getByID);

        return res.status(200).json(result);
    }

    //must login
    //masukin ke keranjang (untuk item hanya berkurang ketika sudah order)(jika item_id yang sama maka akan di update)
    create = async(req: Request, res: Response): Promise<Response> =>{
        
        const t = await sequelize.transaction();

        const item_service:ItemServices = new ItemServices(req);
        const service:CartService = new CartService(req);

        //checking item first
        const checkitem = await item_service.checkItemFromBody();
        
        if(checkitem==undefined){//item tidak ditemukan
            let message:string = "Item_ID not found"
            let data:string = "Item_ID not found"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        if(checkitem["stock"]<req.body["total"]){//checking jika yang diminta lebih banyak dari stock yang ada
            let message:string = "stock to low"
            let data:string = "stock to low"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        //checking if (shopping cart already exist)
        const checking = await service.getByID();
            // console.log(checking);
            
        if(checking[0]!=undefined){//sudah punya shooping cart
            // console.log("masuk");
            
            const cart_id = checking[0]["cart_id"];
            let duplicate = false;
            
            const items = checking[0]["items"];
            // console.log(items);
            

            for (var data of items){
                
                let item_id = data["item_id"];
                
                if(item_id==req.body["item_id"]){//dapet data id yang sama maka tambahkan saja totalnya
 
                    const update = await service.update(cart_id,t);
                    duplicate=true;
                    if(update.errors!=null){
                        await t.rollback();
                        const result:object = MyResponse.error_param(update);
                        return res.status(200).json(result);
                    }
                }

            }
            if(!duplicate){//item baru
                
                //create cart detail baru
                const addItem = await service.create_detail(cart_id,t);
                if(addItem.errors!=null){
                    await t.rollback();
                    const result:object = MyResponse.error_param(addItem);
                    return res.status(200).json(result);
                }

            }

        }else{//dont have shooping cart
            
            const create = await service.create(t);
            if(create.errors!=null){
                await t.rollback();
                const result:object = MyResponse.error_param(create);
                return res.status(200).json(result);
            }

            //create cart header baru
            const cart_id = create["cart_id"];
    
            //create cart detail baru
            const addItem = await service.create_detail(cart_id,t);
            if(addItem.errors!=null){
                await t.rollback();
                const result:object = MyResponse.error_param(addItem);
                return res.status(200).json(result);
            }
        }

        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);
    }

    //not used
    update = async(req: Request, res: Response): Promise<Response> =>{

        //update harusnya tidak terpakai karena data juga terupdate di create.

        return res.status(200).json({
            message:"Api didn't used"
        });
    }

    //not used
    delete = async(req: Request, res: Response): Promise<Response> =>{

        //seharusnya tidak dipakai harena didelet didalam create order.

        return res.status(200).json({
            message:"Api didn't used"
        });

    }

}


export default new ItemController();