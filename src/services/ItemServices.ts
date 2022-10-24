import { Request } from "express";
// import { Sequelize } from "sequelize";
import { sequelize } from "../db/models";
const db = require("../db/models");
var initmodel = require('../db/models/init-models').initModels;
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/database.js')[env];

// var newConnection  = new Sequelize(config.database, config.username, config.password, config);

// try {
//     newConnection.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }


//get all model with association
var models = initmodel(db.sequelize);
var item = models.item;        
var item_catalogue = models.item_catalogue;

class ItemServices{

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

        const result = await item.findAll({
            include:{
                model: item_catalogue,
                as:"myitem",
                attributes:[],
                required:true
            }
            ,attributes:{exclude:['price','item_id'], include:[[sequelize.col("stock"),"stock"]]},
        });
       
        return result;
    }

    getByID = async ()=> {
        const item_id = this.params.id;

        const result = await item.findOne({
                    where:{
                        item_id : item_id
                    },
                    include:{
                        model: item_catalogue,
                        as:"myitem",
                        attributes:[],
                        required:true
                    }
            ,attributes:{exclude:['price','item_id'], include:[[sequelize.col("stock"),"stock"]]},
        });

        // const result = await sequelize.query(`select name,stock
        //                                 from item i 
        //                                 join item_catalogue ic 
        //                                 on i.item_id  = ic.item_id
        //                                 where i.item_id=:id`,{
        //                                     replacements: { id: item_id },
        //                                 });
        return result;
    }

    checkItemFromBody = async ()=> {
        const item_id = this.body["item_id"];
        // console.log(item_id);

        const result = await item.findOne({
            where:{
                item_id : item_id
            },
            include:{
                model: item_catalogue,
                as:"myitem",
                attributes:[],
                required:true
            }
            ,attributes:{exclude:['price','item_id'], include:[[sequelize.col("stock"),"stock"]]},
        });

        // const result = await sequelize.query(`select name,stock
        //                                 from item i 
        //                                 join item_catalogue ic 
        //                                 on i.item_id  = ic.item_id
        //                                 where i.item_id=:id`,{
        //                                     replacements: { id: item_id },
        //                                 });
        return result;
    }

    checkItemFromOrderByID = async (item_id:number)=> {
        // const item_id = this.body["item_id"];
        // console.log(item_id);

        const result = await item.findOne({
            where:{
                item_id : item_id
            },
            include:{
                model: item_catalogue,
                as:"myitem",
                attributes:[],
                required:true
            }
            ,attributes:{exclude:['item_id'], include:[[sequelize.col("stock"),"stock"]]},
        });
        
        // const result = await sequelize.query(`select name,stock
        //                                 from item i 
        //                                 join item_catalogue ic 
        //                                 on i.item_id  = ic.item_id
        //                                 where i.item_id=:id`,{
        //                                     replacements: { id: item_id },
        //                                 });
        return result;
    }

    checkingName = async ()=> {
        const name = this.body["name"];

        const result = await item.findOne({
            where:{
                name : name
            }
        });

        // const result = await sequelize.query(`select * from item
        //                                 where name=:name`,{
        //                                     replacements: { name: name },
        //                                 });
        return result;
    }

    create = async (t:any) => {
        // const t = await sequelize.transaction();
        const name = this.body["name"];
        const price = this.body["price"];

        try {

            const result = await item.create({
                name:name,
                price:price
            },{
                transaction:t
            });

            return result ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }

       
        
        // const result = await sequelize.query(`insert into item (name,price)
        //                                     Values(:name,:price)
        //                                     Returning item_id
        //                                     `,{
        //                                         replacements: { price: price, name: name},
        //                                     });
        
        // return result;
    }

    update = async (t:any) => {
        const name = this.body["name"];
        const price = this.body["price"];
        const item_id = this.params.id;

        try {
            const result = await item.update({
                name:name, 
                price:price
            },{
                where:{
                    item_id:item_id
                },
                transaction:t
            });

            return result ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }

        // const result = await sequelize.query(`update item
        //                                 set "name" = :name,
        //                                 "price"=:price
        //                                 where item_id=:id`,{
        //                                     replacements: {name: name, price:price, id:item_id },
        //                                 });
        
        // return result;
    }

    update_stok = async (item_id:number,stock:number,t:any) => {

        try {
            const result = await item_catalogue.update({
                stock:stock
            },
                {
                where:{
                    item_id:item_id
                },
                transaction:t
            });
            
            return result ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }

        // const result = await sequelize.query(`update item_catalogue
        //                                 set "stock" = :stock
        //                                 where item_id=:id`,{
        //                                     replacements: {id: item_id, stock:stock},
        //                                 });
        
        // return result[0];
    }

    delete = async (t:any) => {
        const item_id = this.params.id;

        try {
            const result = await item.destroy({
                where:{
                    item_id:item_id
                },
                transaction:t
            });


            return result ;

        } catch (error:any) {
            // console.log(error);
            // return error.errors;
            return error;
            
        }

        

        // const result = await sequelize.query(`delete from item
        //                                 where item_id=:id`,{
        //                                     replacements: {  id:item_id },
        //                                 });
        
        // return result[0];
    }


    addItemCatalogue = async (item_id:number,t :any) => {
        const stock = this.body["stock"];

        try {

            const result = await item_catalogue.create({
                item_id:item_id,
                stock:stock
            },{
                transaction:t
            });

            return result ;

        } catch (error:any) {
            // console.log(error);
            // return error.errors;
            return error;
            
        }

        // const result = await sequelize.query(`insert into item_catalogue (item_id,stock)
        //                                 Values(:id,:stock)`,{
        //                                     replacements: {  id:item_id, stock:stock },
        //                                 });
        
        // return result[0];
    }

    updateItemCatalogue = async (t:any) => {
        const item_id = this.params.id;
        const stock = this.body["stock"];
        // console.log(stock);

        try {
            const result = await item_catalogue.update({
                stock:stock
            },
            {
                where:{
                    item_id:item_id
                },
                transaction:t
            });

            return result ;

        } catch (error:any) {
            // console.log(error);
            // return error.errors;
            return error;
            
        }
        
       

        // const result = await sequelize.query(`update item_catalogue
        //                                 set "stock" = :stock
        //                                 where item_id=:id`,{
        //                                     replacements: {  id:item_id, stock:stock },
        //                                 });
        
        // return result;
    }

    deleteItemCatalogue = async (t:any) => {
        const item_id = this.params.id;

        try {
            const result = await item_catalogue.destroy({
                where:{
                    item_id:item_id
                },
                transaction:t
            });

            return result ;

        } catch (error:any) {
            // console.log(error);
            // return error.errors;
            return error;
            
        }

        

        // const result = await sequelize.query(`delete from item_catalogue
        //                                 where item_id=:id`,{
        //                                     replacements: {  id:item_id},
        //                                 });
    
        // return result;
    }

    
    
}

export default ItemServices;