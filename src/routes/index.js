import { Router } from "express";
import UserRouterCustom from "./user.router.js";
import ProductsRouterCustom from "./products.router.js";

const router = Router();

const userRouter = new UserRouterCustom();
const productsRouter = new ProductsRouterCustom();

router.use("/api/users", userRouter.getRouter());
router.use("/api/products", productsRouter.getRouter());

export default router;
