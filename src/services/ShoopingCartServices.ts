import { Request } from "express";
import { sequelize } from "../db/models";
const db = require("../db/models");
var initmodel = require('../db/models/init-models').initModels;


//get all model with association
var models = initmodel(db.sequelize);
var item = models.item;        
var item_catalogue = models.item_catalogue;
var shopingcart = models.shooping_cart;
var cartDetail = models.cart_detail;

class CartService{

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

        const result = shopingcart.findAll({
            order:[
                ['cart_id']
            ]
        })
        // const result = await sequelize.query(`select *
        //                                 from shooping_cart
        //                                 order by cart_id`);
        
        return result;
    }

    getByID = async ()=> {
        
        const cust_id = this.credential.id;
        // console.log(cust_id);
        
        // const cust_id = 5
        //using left join
        const result = shopingcart.findAll({
            include:{
                model:cartDetail,
                as:"items",
                attributes:["cart_id","item_id","total"],
                // required:true
            },
            where:{
                customer_id:cust_id
            }
        })

        // const result = await sequelize.query(`select * from shooping_cart sc natural join 
        //                                     cart_detail cd 
        //                                     where customer_id =:id
        //                                     order by cart_detail_id`,{
        //                                     replacements: { id: cust_id },
        //                                 });
        return result;
    }


    create = async (t:any) => {
        
        const cust_id = this.credential.id;

        try {

            const result = await shopingcart.create({
                customer_id:cust_id
            },{
                transaction:t
            });

            return result ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }
        
        // const result = await sequelize.query(`insert into shooping_cart (customer_id)
        //                                 Values(:id)
        //                                 RETURNING cart_id`,{
        //                                     replacements: { id: cust_id},
        //                                 });
        
        // return result;
    }

    create_detail = async (cart_id:number,t:any) => {
        const item_id = this.body["item_id"];
        const total = this.body["total"];

        try {
            const result = await cartDetail.create({
                cart_id:cart_id,
                item_id:item_id,
                total:total
            },{
                transaction:t
            });

            return result;

        } catch (error) {
            console.log(error);
            // return error.errors;
            return error;
            
        }
        
        
        // const result = await sequelize.query(`insert into cart_detail (cart_id,item_id,total)
        //                                 Values(:id,:item_id,:stock)`,{
        //                                     replacements: { id: cart_id, item_id: item_id, stock: total},
        //                                 });
        
        // return result;
    }

    update = async (cart_id:number,t:any) => {
        const item_id = this.body["item_id"];
        const total = this.body["total"];

        try {
            const result = await cartDetail.update({
                total:total
            },
                {
                where:{
                    item_id:item_id,
                    cart_id : cart_id
                },
                transaction:t
            });

            return result ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }

        const result = await cartDetail.update({
            total:total
        },
            {
            where:{
                item_id:item_id,
                cart_id : cart_id
            }
        });

        // const result = await sequelize.query(`update cart_detail 
        //                                 set "total" = :stock
        //                                 where cart_id = :id and item_id = :item_id`,{
        //                                     replacements: {stock: total, item_id:item_id, id:cart_id },
        //                                 });
        
        return result;
    }

    delete = async (cart_id:number) => {
        const cust_id = this.credential.id;

        const result = await shopingcart.destroy({
            where:{
                cart_id:cart_id,
                customer_id:cust_id
            }
        });

        // const result = await sequelize.query(`delete from shooping_cart
        //                                 where cart_id=:id and customer_id=:cust_id`,{
        //                                     replacements: {  id:cart_id, cust_id:cust_id },
        //                                 });
        
        return result;
    }

    manual_delete_cart_detail = async (item_id:number,cart_id:number,t:any) => {
        // const cust_id = this.credential.id;

        const result = await cartDetail.destroy({
            where:{
                cart_id:cart_id,
                item_id:item_id
            },
            transaction:t
        });

        
        return result;
    }

    CalculatelastStock = async () => {
        const cust_id = this.credential.id;

        const result = await shopingcart.findAll({
            include:{
                model: cartDetail,
                as:"items",
                attributes:['item_id'],
                required:true,
                include:{
                    model: item,
                    as:"item",
                    required:true,
                    include:{
                        model: item_catalogue,
                        as:"myitem",
                        attributes:['stock'],
                        required:true,
                    }
                }
            },where:{
                customer_id:cust_id
            }
            ,attributes:{exclude:['cart_id','customer_id']}
        });

        // const result = await sequelize.query(`SELECT cd.item_id, (stock-total)as hasil
        //                                 from shooping_cart sc 
        //                                 join cart_detail cd  
        //                                 on sc.cart_id = cd.cart_id 
        //                                 join item_catalogue i
        //                                 on i.item_id =cd.item_id 
        //                                 where sc.customer_id =:id`,{
        //                                     replacements: {  id:cust_id },
        //                                 });
        
        return result;
    }

    calculate_price = async () => {
        
        const cust_id = this.credential.id;

        const result = shopingcart.findAll({
            include:{
                model:cartDetail,
                as:"items",
                // attributes:[],
                required:true
            },
            where:{
                customer_id:cust_id
            }
        })

        // const result = await sequelize.query(`select sum(price * total) as hasil
        //                                 from shooping_cart sc 
        //                                 join cart_detail cd  
        //                                 on sc.cart_id = cd.cart_id 
        //                                 join item i 
        //                                 on cd.item_id = i.item_id 
        //                                 where customer_id =:id`,{
        //                                     replacements: { id:cust_id},
        //                                 });
        
        return result;
    }

}

export default CartService;