import BaseRoutes from "./BaseRouter";
import CustomerController from "../controllers/CustomerController";
import validate from "../middleware/customerValidation";

class Customer extends BaseRoutes{
    
    public routes(): void {

        this.router.get("/get", CustomerController.getAll);

        this.router.get("/get/:id", CustomerController.getById);

        this.router.post("/add",  CustomerController.create);

        this.router.put("/update/:id", CustomerController.update);
    
        this.router.delete("/delete/:id", CustomerController.delete);

    }
    
}

export default new Customer().router;