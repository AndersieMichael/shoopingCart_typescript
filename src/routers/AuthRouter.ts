import AuthController from "../controllers/AuthController";
import loginValidate from "../middleware/AuthValidation";
import BaseRoutes from "./BaseRouter";

class Authentication extends BaseRoutes{
    
    public routes(): void {

        this.router.post("/login", loginValidate, AuthController.login);

    }
    
}

export default new Authentication().router;