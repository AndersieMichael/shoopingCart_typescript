import BaseRoutes from "./BaseRouter";
import ItemController from "../controllers/ItemController";
import Itemvalidate from "../middleware/ItemValidation";

class Item extends BaseRoutes{
    
    public routes(): void {

        this.router.get("/get", ItemController.getAll);

        this.router.get("/get/:id", ItemController.getById);

        this.router.post("/add", ItemController.create);

        this.router.put("/update/:id", ItemController.update);
    
        this.router.delete("/delete/:id", ItemController.delete);
    }
    
}

export default new Item().router;