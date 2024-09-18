import UserController from "../controllers/user.controller.js";
import { invokePassport } from "../middlewares/handleError.js";
import CustomRouter from "./customRouter.js";

const userController = new UserController();

export default class UserRouterCustom extends CustomRouter {
  init() {
    this.post("/register", ["PUBLIC"], userController.register);
    this.post("/login", ["PUBLIC"], userController.login);
    this.get(
      "/current",
      ["USER", "ADMIN"],
      invokePassport("current"),
      userController.getCurrent
    );
    this.get("/logout", ["USER", "ADMIN"], userController.logout);
  }
}
