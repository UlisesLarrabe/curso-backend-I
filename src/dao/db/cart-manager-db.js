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
      const cart = await CartModel.findById(id)
        .populate("products.product")
        .lean();
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

  async deleteProductFromCart(idCart, idProduct) {
    try {
      const cart = await CartModel.findById(idCart);
      if (!cart) {
        return { status: "error", message: "Cart not found", code: 400 };
      }
      const cartWithoutProduct = cart.products.filter((product) => {
        return product.product.toString() !== idProduct;
      });
      cart.products = cartWithoutProduct;
      await cart.save();
      return {
        status: "success",
        message: "Product deleted from cart successfully",
        code: 200,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async addArrayProducts(idCart, products) {
    try {
      const cart = await CartModel.findById(idCart);
      products.forEach((product) => {
        const productIsInCart = cart.products.find((prod) => {
          return prod.product.toString() === product.product;
        });
        if (productIsInCart) {
          productIsInCart.quantity += product.quantity;
        } else {
          cart.products.push({
            product: product.product,
            quantity: product.quantity,
          });
        }
      });
      cart.markModified("products");
      await cart.save();
      return {
        status: "success",
        message: "Products added to cart successfully",
      };
    } catch (error) {
      console.log(error);
    }
  }
  async updateProductQuantity(idCart, idProduct, quantity) {
    try {
      const cart = await CartModel.findById(idCart);
      const productIsInCart = cart.products.find((product) => {
        return product.product.toString() === idProduct;
      });
      if (productIsInCart) {
        productIsInCart.quantity += quantity;
      }
      cart.markModified("products");
      await cart.save();
      return {
        status: "success",
        message: "Product added to cart successfully",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAllProducts(idCart) {
    try {
      const cart = await CartModel.findById(idCart);
      cart.products = [];
      cart.markModified("products");
      await cart.save();
      return {
        status: "success",
        message: "Products deleted from cart successfully",
      };
    } catch (error) {}
  }
}

export default CartManager;
