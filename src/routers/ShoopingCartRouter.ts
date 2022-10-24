import BaseRoutes from "./BaseRouter";
import ShoopingcartController from "../controllers/ShoopingcartController";
import Cartvalidate from "../middleware/CartValidation";
import { auth } from "../middleware/AuthMiddleware";

class ShoopingCart extends BaseRoutes{
    
    public routes(): void {

        this.router.get("/get", ShoopingcartController.getAll);

        this.router.get("/getid", auth, ShoopingcartController.getById);

        this.router.post("/add",auth, ShoopingcartController.create);

        this.router.put("/update",auth, ShoopingcartController.update);
    
        this.router.delete("/delete", ShoopingcartController.delete);
    }
    
}

export default new ShoopingCart().router;