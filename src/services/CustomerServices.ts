import { Request } from "express";
import {  sequelize } from "../db/models";
const db = require("../db/models");

class CustomerServices{

    id:number;

    body:Request['body'];
    params: Request['params'];



    constructor(req: Request){
        this.id = req.app.locals.credential;
        this.body = req.body;
        this.params = req.params;
    }

    getAll = async ()=>{
        
        const result = await db.customer.findAll({
            attributes:[['customer_id','id'],'name','username', 'phone_number'],//customer_id as id
            order:[
                ['customer_id']
            ]
        });
        return result;
    }

    getByID = async ()=> {
        const cust_id = this.params.id;

        const result = await db.customer.findOne({
            attributes:[['customer_id','id'],'name','username', 'phone_number'],//customer_id as id
            where:{
                customer_id:cust_id
            }
        });


        return result;
    }

    checkUsername = async ()=> {
        const username = this.body["username"];
        
        const result = await db.customer.findOne({
            attributes:[['customer_id','id'],'name','username', 'phone_number','password'],//customer_id as id
            where:{
                username:username
            }
        });

        return result;
    }

    create = async (password : string,t:any) => {
        const name = this.body["name"];
        const phone = this.body["phone"];
        const username = this.body["username"];

        try {
            const result = await db.customer.create({
                name:name, 
                username:username,
                phone_number:phone,
                password:password
            },{
                transaction:t
            });

            return result ;

        } catch (error:any) {
            // console.log(error);
            // return error.errors;
            return error;
            
        }
    }

    update = async (password : string,t:any) => {
        const name = this.body["name"];
        const phone = this.body["phone"];
        const username = this.body["username"];
        const cust_id = this.params.id;

        try {
            const result = await db.customer.update({
                name:name, 
                username:username,
                phone_number:phone,
                password:password  
            },{
                where:{
                    customer_id:cust_id
                },
                transaction:t
            });

            return "" ;

        } catch (error:any) {
            console.log(error);
            // return error.errors;
            return error;
            
        }
        
        
    }

    delete = async (t:any) => {
        const cust_id = this.params.id;

        const result = await db.customer.destroy({
            where:{
                customer_id:cust_id
            },
            transaction:t
        });

        return result;
    }
    
}

export default CustomerServices;