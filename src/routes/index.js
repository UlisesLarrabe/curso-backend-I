import { Router } from "express";
import UserRouterCustom from "./user.router.js";

const router = Router();

const userRouter = new UserRouterCustom();

router.use("/api/users", userRouter.getRouter());

export default router;
