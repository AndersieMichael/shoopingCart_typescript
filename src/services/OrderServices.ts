import { Request } from "express";
import { sequelize } from "../db/models";

const db = require("../db/models");
var initmodel = require('../db/models/init-models').initModels;


//get all model with association
var models = initmodel(db.sequelize);
var order_header = models.order_header;        
var order_detail = models.order_detail;

class OrderService{

    credential:{
        id:number
    };;

    body:Request['body'];
    params: Request['params'];



    constructor(req: Request){
        this.credential = req.app.locals.credential;
        this.body = req.body;
        this.params = req.params;
    }

    getAll = async ()=>{

        const result = order_header.findAll({
            order:[
                ['order_header_id']
            ]
        })
        
        return result;
    }

    getDetailByCustomer_ID = async ()=> {
        
        const cust_id = this.credential.id;
        // console.log(header_id);

        const result = order_header.findAll({
            include:{
                model:order_detail,
                as:'order_details',
                attributes:{exclude:['order_header_id']},
                required:true
            },
            where:{
                customer_id : cust_id
            },
            attributes:{exclude:['customer_id']}
        })
        
        return result;
    }

    getByID = async ()=> {
        
        const header_id = this.body["header_id"];
        // console.log(header_id);

        const result = order_header.findOne({
            where:{
                order_header_id:header_id
            }
        })

        return result;
    }

    create_order = async (price:number,t:any) => {
        
        const cust_id = this.credential.id;

        try {
            const result = order_header.create({
                customer_id:cust_id,
                status:false,
                total_price:price
            },{
                transaction:t
            });

            return result ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }

        
        
        // const result = await sequelize.query(`insert into order_header (customer_id,status,total_price)
        //                                     Values(:id,false,:price)
        //                                     RETURNING order_header_id`,{
        //                                     replacements: { id: cust_id,price: price},
        //                                 });
        
        // return result;
    }

    create_order_detail = async (cart_id:number,header_id:number,t:any) => {
        console.log(header_id);

        const result = await sequelize.query(`WITH moved_rows AS (
            DELETE FROM cart_detail cd 
            WHERE cart_id =:id
            RETURNING :header::integer,item_id,total
        )
        INSERT INTO order_detail(order_header_id,item_id,total_pcs) 
        SELECT * FROM moved_rows;`,{
            replacements: { id: cart_id,header:header_id},
        });
        
        return result[0];
    }

    manual_create_order_detail = async (header_id:number,item_id:number,total:number,t:any) => {
         try {
            const result = order_detail.create({
                order_header_id:header_id,
                item_id:item_id,
                total_pcs:total
            },{
                transaction:t
            });

            return result ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }
    }

    status_update = async (t:any) => {
        const header = this.body["header_id"];

        try {
            const result = order_header.update({
                status:true
            },{
                where :{
                    order_header_id:header
                },
                transaction:t
            })
            
            return result ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }

        

        // const result = await sequelize.query(`update order_header
        //                                     set "status" = true
        //                                     where order_header_id = :id`,{
        //                                     replacements: { id:header},
        //                                 });
        
        // return result;
    }


}

export default OrderService;