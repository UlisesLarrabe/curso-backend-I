import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const { limit } = req.query;
    if (limit) {
      const productsSliced = products.slice(0, limit);
      return res.status(200).json({
        status: "success",
        payload: productsSliced,
      });
    }
    return res.status(200).json({
      status: "success",
      payload: products,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error,
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.json({
      status: "success",
      payload: product,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { status, message, payload } = await productManager.addProduct(
      req.body
    );
    if (status === "error") {
      return res.status(400).json({
        status,
        message,
      });
    }
    return res.status(201).json({
      status,
      message,
      payload,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    console.log(req.body);
    const { status, message } = await productManager.updateProduct(
      pid,
      req.body
    );
    if (status === "error") {
      return res.status(400).json({
        status,
        message,
      });
    }
    res.json({
      status,
      message,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { status, message } = await productManager.deleteProduct(pid);
    if (status === "error") {
      return res.status(400).json({
        status,
        message,
      });
    }
    res.status(200).json({
      status,
      message,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error,
    });
  }
});

export default router;
