import { Router } from "express";
import { getProducts } from "../controllers/productManager.js";
const router = Router();

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

router.get("/home", async (req, res) => {
  const products = await getProducts();
  res.render("home", products);
});

export default router;
