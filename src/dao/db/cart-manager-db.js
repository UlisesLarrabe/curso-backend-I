import CartModel from "../models/cart.model.js";

class CartManager {
  async addCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      return error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await CartModel.findById(id).populate("products.product");
      if (!cart) {
        return { status: "error", message: "Cart not found" };
      }
      return { status: "success", message: "Cart found", payload: cart };
    } catch (error) {
      return { status: "error", message: error };
    }
  }

  async addProductToCartWithId(idCart, idProduct, quantity) {
    try {
      const cart = await CartModel.findById(idCart);
      const productIsInCart = cart.products.find((product) => {
        console.log(product.product);
        return product.product.toString() === idProduct;
      });
      if (productIsInCart) {
        productIsInCart.quantity += quantity;
      } else {
        cart.products.push({ product: idProduct, quantity });
      }
      cart.markModified("products");
      await cart.save();
      return {
        status: "success",
        message: "Product added to cart successfully",
        payload: cart,
      };
    } catch (error) {
      return { status: "error", message: error };
    }
  }
}

export default CartManager;
