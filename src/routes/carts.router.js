import { Router } from "express";
import {
  addCart,
  addProductToCartWithId,
  getCartWithId,
} from "../controllers/cartManager.js";

const router = Router();

router.post("/", async (req, res) => {
  const { status, message } = await addCart();
  res.status(200).json({ status, message });
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { status, cart, message } = await getCartWithId(parseInt(cid));
  if (status === false) return res.status(400).json({ status, error: message });
  return res.status(200).json({ status, cart, message });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const { status, message } = await addProductToCartWithId(
    parseInt(cid),
    parseInt(pid),
    quantity
  );
  if (status === false) return res.status(400).json({ status, error: message });
  return res.status(200).json({ status, message });
});

export default router;
