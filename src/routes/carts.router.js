import CartController from "../controllers/cart.controller.js";
import CustomRouter from "./customRouter.js";

const cartController = new CartController();

export default class CartRouterCustom extends CustomRouter {
  init() {
    this.post("/", ["USER"], cartController.createCart);
    this.get("/:cid", ["USER"], cartController.getCartById);
    this.post(
      "/:cid/product/:pid",
      ["USER"],
      cartController.addProductToCartWithId
    );
    this.delete(
      "/:cid/products/:pid",
      ["USER"],
      cartController.deleteProductFromCart
    );
    this.delete("/:cid", ["USER"], cartController.deleteCart);
    this.put("/:cid", ["USER"], cartController.addArrayProducts);
    this.put(
      "/:cid/products/:pid",
      ["USER"],
      cartController.updateProductQuantity
    );
  }
}
