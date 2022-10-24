import { Request, Response } from "express";

interface Icontroller{
    
    getAll(req: Request, res:Response):Promise<Response>;

    getById(req: Request, res:Response):Promise<Response>;

    create(req: Request, res:Response):Promise<Response>;

    update(req: Request, res:Response):Promise<Response>;

    delete(req: Request, res:Response):Promise<Response>;
    
}

export default Icontroller;