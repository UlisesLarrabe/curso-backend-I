import { Router } from "express";

import { invokePassport } from "../middlewares/handleError.js";
import ProductService from "../services/product.services.js";
import CartService from "../services/cart.services.js";

const router = Router();
const productManager = new ProductService();
const cartManager = new CartService();

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

router.get("/home", invokePassport("current"), async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const sort = req.query.sort;
  const category = req.query.category;
  const response = await productManager.getAllProducts(
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
  const username = req.user.first_name;
  const isAdmin = req.user.role === "admin";

  res.render("home", {
    products: arrayDocs,
    hasPrevPage: response.hasPrevPage,
    hasNextPage: response.hasNextPage,
    prevPage: response.prevPage,
    nextPage: response.nextPage,
    currentPage: response.page,
    username: username,
    isAdmin: isAdmin,
  });
});

router.get("/carts/:cid", async (req, res) => {
  const response = await cartManager.getCartById(req.params.cid);
  res.render("cart", { products: response.payload.products });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

export default router;
