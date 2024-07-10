import { Router } from "express";
import CartManager from "../dao/db/cart-manager-db.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.status(201).json({ status: "success", cart: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { status, message, payload } = await cartManager.getCartById(cid);
    if (status === "error") {
      return res.status(400).json({ status, message });
    }
    return res.status(201).json({ status, message, payload });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const { status, message, payload } =
      await cartManager.addProductToCartWithId(cid, pid, quantity);
    if (status === "error") {
      return res.status(400).json({ status, message });
    }
    return res.status(201).json({ status, message, payload });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { status, message, code } = await cartManager.deleteProductFromCart(
      cid,
      pid
    );
    res.status(code).json({
      status,
      message,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { payload: products } = req.body;
    const { message, status } = await cartManager.addArrayProducts(
      cid,
      products
    );
    res.status(200).json({
      status,
      message,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const { status, message } = await cartManager.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    res.status(200).json({
      status,
      message,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { status, message } = await cartManager.deleteAllProducts(cid);
    res.status(200).json({
      status,
      message,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

export default router;
