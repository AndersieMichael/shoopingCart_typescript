import BaseRoutes from "./BaseRouter";
import OrderController from "../controllers/OrderController";
import { auth } from "../middleware/AuthMiddleware";
import Ordervalidate from "../middleware/OrderValidation";

class Order extends BaseRoutes{
    
    public routes(): void {

        this.router.get("/get", OrderController.getAll);

        this.router.get("/get/history", auth, OrderController.getById);

        this.router.post("/add", auth, OrderController.create);

        this.router.get("/update", auth, OrderController.update);
    
        this.router.delete("/delete/:id", OrderController.delete);
    }
    
}

export default new Order().router;