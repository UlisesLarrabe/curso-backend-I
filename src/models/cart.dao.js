import CartModel from "./cart.model.js";
import MongoDao from "./dao.js";

export default class CartAccessMongo extends MongoDao {
  constructor() {
    super(CartModel);
  }

  async getPopulateCartById(id) {
    try {
      const cart = await this.model
        .findById(id)
        .populate("products.product")
        .lean();
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductToCartWithId(idCart, idProduct, quantity) {
    try {
      const cart = await this.getById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const productIsInCart = cart.products.find((product) => {
        return product.product.toString() === idProduct;
      });
      if (productIsInCart) {
        productIsInCart.quantity += quantity;
      } else {
        cart.products.push({ product: idProduct, quantity });
      }
      cart.markModified("products");
      await cart.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProductFromCart(idCart, idProduct) {
    try {
      const cart = await this.getById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const cartWithoutProduct = cart.products.filter((product) => {
        return product.product.toString() !== idProduct;
      });
      cart.products = cartWithoutProduct;
      await cart.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProductQuantity(idCart, idProduct, quantity) {
    try {
      const cart = await this.getById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const productIsInCart = cart.products.find((product) => {
        return product.product.toString() === idProduct;
      });
      if (productIsInCart) {
        productIsInCart.quantity += quantity;
      }
      cart.markModified("products");
      await cart.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAllProducts(idCart) {
    try {
      const cart = await this.getById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
      }
      cart.products = [];
      cart.markModified("products");
      await cart.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
