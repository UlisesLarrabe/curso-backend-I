import CartAccessMongo from "../models/cart.dao.js";
import Services from "./services.js";

const cartDao = new CartAccessMongo();

export default class CartService extends Services {
  constructor() {
    super(cartDao);
  }

  async addCart() {
    try {
      const newCart = await this.dao.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.dao.getPopulateCartById(id);
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductToCartWithId(idCart, idProduct, quantity) {
    try {
      const response = await this.dao.addProductToCartWithId(
        idCart,
        idProduct,
        quantity
      );
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProductFromCart(idCart, idProduct) {
    try {
      const response = await this.dao.deleteProductFromCart(idCart, idProduct);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addArrayProducts(idCart, products) {
    try {
      products.forEach(async (product) => {
        await this.addProductToCartWithId(
          idCart,
          product._id,
          product.quantity
        );
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProductQuantity(idCart, idProduct, quantity) {
    try {
      const response = await this.dao.updateProductQuantity(
        idCart,
        idProduct,
        quantity
      );
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAllProducts(idCart) {
    try {
      const response = await this.dao.deleteAllProducts(idCart);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
