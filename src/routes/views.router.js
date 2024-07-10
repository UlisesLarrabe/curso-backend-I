import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

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
    const newId = _id.toString();
    return { newId, ...rest };
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

router.get("/carts/:cid", async (req, res) => {
  const response = await cartManager.getCartById(req.params.cid);
  res.render("cart", { products: response.payload.products });
});

export default router;
