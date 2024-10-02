import { Router } from "express";
import UserRouterCustom from "./user.router.js";
import ProductsRouterCustom from "./products.router.js";
import CartRouterCustom from "./carts.router.js";

const router = Router();

const userRouter = new UserRouterCustom();
const productsRouter = new ProductsRouterCustom();
const cartRouter = new CartRouterCustom();

router.use("/api/users", userRouter.getRouter());
router.use("/api/products", productsRouter.getRouter());
router.use("/api/carts", cartRouter.getRouter());

export default router;
