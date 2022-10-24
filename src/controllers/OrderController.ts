import { Request, Response } from "express";
import Icontroller from "./ControllerInterface";
import OrderService from "../services/OrderServices";
import CartService from "../services/ShoopingCartServices";
import ItemServices from "../services/ItemServices";
import { sequelize } from "../db/models";
import MyResponse from "../response/Responses";

class OrderController implements Icontroller{

    getAll= async (req: Request, res: Response): Promise<Response> => {

        const service:OrderService = new OrderService(req);
        const getAll = await service.getAll();

        const result = MyResponse.Success_showData(getAll);
 
        return res.status(200).json(result);
    
    }

    getById= async(req: Request, res: Response): Promise<Response> =>{ 


        const service:OrderService = new OrderService(req);
        const result = await service.getDetailByCustomer_ID();

        if(result==null){//data kosong
            let message:string = "there is no order history"
            let data:string = "no order history"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        return res.status(200).json({
            message:"success",
            data: result
        });
    }

    create = async(req: Request, res: Response): Promise<Response> =>{

        const t = await sequelize.transaction();

        let price:number=0;

        const item_service:ItemServices = new ItemServices(req);

        const cartService:CartService = new CartService(req);

        const service:OrderService = new OrderService(req);

        const checking_cart = await cartService.getByID();

        // console.log(checking_cart);
        
        if(checking_cart[0]==undefined){//data kosong
            let message:string = "doesn't have shoopingcart"
            let data:string = "doesn't have shoopingcart"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        if(checking_cart[0]["items"][0]==undefined){//data kosong
            let message:string = "doesn't have item"
            let data:string ="doesn't have item"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);
        }

        for(var data of checking_cart[0]['items']){//looping melakukan check apakah stock tersedia
            let item_id:number = data["item_id"];
            let stock : number = data["total"];
            // console.log(item_id, stock);

            //checking item first
            const checkitem = await item_service.checkItemFromOrderByID(item_id);
            // console.log(checkitem);
            
            if(checkitem==undefined){//item tidak ditemukan
                let message:string = "Item_ID not found"
                let data:string = "Item_ID not found"
                
                const result:object = MyResponse.internal_error(message,data);

                return res.status(200).json(result);
                
            }

            if(checkitem["stock"]<stock){//checking jika yang diminta lebih banyak dari stock yang ada
                let message:string = "stock to low"
                let data:string = "stock to low"
                
                const result:object = MyResponse.internal_error(message,data);

                return res.status(200).json(result);

            }
            // console.log(price);
            price += (checkitem["price"] * stock);
            
        }
        
        const cart_id = checking_cart[0]["cart_id"];
        // console.log(cart_id);
        
        const lastStock = await cartService.CalculatelastStock();
        // console.log(lastStock);
        
        for(var data of checking_cart[0]['items']){//melakukan update pada database terbaru (pengurangan stock)

            let need_id:number = data["item_id"];
            let need : number = data["total"];

            for(var data2 of lastStock[0]["items"]){

                let item_id:number = data2["item_id"];
                let stock : number = data2["item"]["myitem"][0]["stock"];
                
                if(need_id==item_id){
                    let calculate_stock:number = stock - need;
                    // console.log(calculate_stock);
                    
                    const updateStock = await item_service.update_stok(item_id,calculate_stock,t);
                    if(updateStock.errors!=null){
                        await t.rollback();
                        const result:object = MyResponse.error_param(updateStock);
                        return res.status(200).json(result);
                    }
                    // console.log(updateStock);
                    break;
                }
                
            }

        }
        
        //create order Header
        const create_order = await service.create_order(price,t);
        if(create_order.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(create_order);
            return res.status(200).json(result);
        }
        // console.log(result);
        
        for(var data of checking_cart[0]['items']){//melakukan pindah data item dari shooping cart ke order secara manual
            // console.log(data["item_id"],data["total"]);
            
            const create_Detail = await service.manual_create_order_detail(create_order["order_header_id"], data["item_id"],data["total"],t);
            if(create_Detail.errors!=null){
                await t.rollback();
                const result:object = MyResponse.error_param(create_Detail);
                return res.status(200).json(result);
            }

            const delete_cart_detail = await cartService.manual_delete_cart_detail( data["item_id"],data["cart_id"],t);
            if(delete_cart_detail.errors!=null){
                await t.rollback();
                const result:object = MyResponse.error_param(delete_cart_detail);
                return res.status(200).json(result);
            }

        }
        
        
        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);
    }

    update = async(req: Request, res: Response): Promise<Response> =>{

        const t = await sequelize.transaction();

        const service:OrderService = new OrderService(req);

        const checkingID = await service.getByID();
        // console.log(checkingID);
        
        if(checkingID[0]==undefined){
            let message:string ="ID not found"
            let data:string = "ID not found"
            
            const result:object = MyResponse.internal_error(message,data);

            return res.status(200).json(result);

        }

        const update_Status = await service.status_update(t);
        if(update_Status.errors!=null){
            await t.rollback();
            const result:object = MyResponse.error_param(update_Status);
            return res.status(200).json(result);
        }

        await t.commit();
        const result:object = MyResponse.Success();
        return res.status(200).json(result);
    }

    delete= async(req: Request, res: Response): Promise<Response> =>{
        
        const service:OrderService = new OrderService(req);

        const checkingID = await service.getByID();

        if(checkingID.length==0){
            return res.status(200).json({
                "message": "Failed",
                "error_key": "error_internal_server",
                "error_message": "ID not found",
                "error_data": "ID not found"
            });
        }

      
        return res.status(200).json({
            message:"success",
        });

    }

}

export default new OrderController();