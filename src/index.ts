import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

//ROUTES
import CustomerRouter from "./routers/CustomerRouter";
import AuthRouter from "./routers/AuthRouter";
import ItemRouter from "./routers/ItemRouter";
import ShoopingCartRouter from "./routers/ShoopingCartRouter";
import OrderRouter from "./routers/OrderRouter";

class Main{
    public app: Application;

    constructor(){
        this.app = express();
        this.plugin();
        this.routes();
        dotenv.config();
        
    }

    protected plugin(): void{
        this.app.use(bodyParser.json());
        this.app.use(morgan("dev"));
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(compression());
    }

    protected routes():void{
        const v1:string = "/api/v1";

        this.app.route("/").get((req:Request, res:Response)=>{
            res.send("This is Testing");
        });

        this.app.use(`${v1}/customer`,CustomerRouter);
        this.app.use(`${v1}/authentication`,AuthRouter);
        this.app.use(`${v1}/item`,ItemRouter);
        this.app.use(`${v1}/cart`,ShoopingCartRouter);
        this.app.use(`${v1}/order`,OrderRouter);

    }

};

const port: number = 8080;
const app = new Main().app;

app.listen(port,()=>{
    console.log(`Application is running in port ${port}`);
    
});