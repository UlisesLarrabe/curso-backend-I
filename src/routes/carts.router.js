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

export default router;
