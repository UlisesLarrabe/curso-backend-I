import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = Router();
const productManager = new ProductManager();

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

router.get("/home", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const sort = req.query.sort;
  const category = req.query.category;
  const response = await productManager.getProducts(
    category,
    limit,
    page,
    sort
  );
  let arrayDocs = response.docs.map((product) => {
    const { _id, ...rest } = product;
    return rest;
  });
  res.render("home", {
    products: arrayDocs,
    hasPrevPage: response.hasPrevPage,
    hasNextPage: response.hasNextPage,
    prevPage: response.prevPage,
    nextPage: response.nextPage,
    currentPage: response.page,
  });
});

export default router;
