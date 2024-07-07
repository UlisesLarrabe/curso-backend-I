import { Router } from "express";
import ProductModel from "../dao/models/product.model.js";

const router = Router();

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

router.get("/home", async (req, res) => {
  const allProducts = await ProductModel.find().lean();
  res.render("home", { products: allProducts });
});

export default router;
