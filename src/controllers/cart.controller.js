import CartService from "../services/cart.services.js";
import { createResponse } from "../utils/createResponse.js";
import Controllers from "./controllers.js";

const cartService = new CartService();

export default class CartController extends Controllers {
  constructor() {
    super(cartService);
  }

  getCartById = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const cart = await this.service.getCartById(cid);
      if (!cart) return createResponse(res, 404, "Cart not found");
      return createResponse(res, 200, cart);
    } catch (error) {
      next(error);
    }
  };

  createCart = async (req, res, next) => {
    try {
      const newCart = await this.service.addCart();
      return createResponse(res, 200, newCart);
    } catch (error) {
      next(error);
    }
  };

  addProductToCartWithId = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const response = await this.service.addProductToCartWithId(
        cid,
        pid,
        quantity
      );
      if (!response)
        return createResponse(res, 400, "Could not add product to cart");
      return createResponse(res, 200, "Product added to cart");
    } catch (error) {
      next(error);
    }
  };

  deleteProductFromCart = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const response = await this.service.deleteProductFromCart(cid, pid);
      if (!response)
        return createResponse(res, 400, "Could not delete product from cart");
      return createResponse(res, 200, "Product deleted from cart");
    } catch (error) {
      next(error);
    }
  };

  addArrayProducts = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const { payload: products } = req.body;
      const response = this.service.addArrayProducts(cid, products);
      if (!response)
        return createResponse(res, 400, "Could not add products to cart");
      return createResponse(res, 200, "Products added to cart");
    } catch (error) {
      next(error);
    }
  };

  updateProductQuantity = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const response = await this.service.updateProductQuantity(
        cid,
        pid,
        quantity
      );
      if (!response)
        return createResponse(
          res,
          400,
          "Could not modify product from the cart"
        );
      return createResponse(res, 200, "Product modified from the cart");
    } catch (error) {
      next(error);
    }
  };

  deleteCart = async (req, res, next) => {
    try {
      const { cid } = req.params;

      const response = await this.service.deleteAllProducts(cid);
      if (!response)
        return createResponse(res, 400, "Could not delete the cart");
      return createResponse(res, 200, "Cart deleted");
    } catch (error) {
      next(error);
    }
  };

  purchase = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const { email } = req.user;
      const response = await this.service.endPurchaseOfCart(cid, email);
      if (!response)
        return createResponse(res, 400, "Could not complete the purchase");
      return createResponse(res, 200, response);
    } catch (error) {
      next(error);
    }
  };
}
