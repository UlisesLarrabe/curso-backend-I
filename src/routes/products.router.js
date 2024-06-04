import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../app.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await getProducts();
  const { limit } = req.query;
  if (limit) {
    const productsSliced = products.slice(0, limit);
    return res.status(200).send(productsSliced);
  }
  return res.status(200).send(products);
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await getProductById(parseInt(pid));
  res.send(product);
});

router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;
  const newProduct = { title, description, price, thumbnail, code, stock };
  const { status, message } = await addProduct(newProduct);
  if (status === false) return res.status(400).json({ status, error: message });
  return res.status(201).send({ status, message });
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const productToUpdate = req.body;
  const { status, message } = await updateProduct(
    parseInt(pid),
    productToUpdate
  );
  if (status === false) {
    return res.status(400).json({ status, error: message });
  }
  return res.status(200).send({ status, message });
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { status, message } = await deleteProduct(parseInt(pid));
  if (status === false) {
    return res.status(400).json({ status, error: message });
  }
  return res.status(200).send({ status, message });
});

export default router;
