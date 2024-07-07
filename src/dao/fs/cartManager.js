import fs from "fs/promises";
import { getProductById } from "./productManager.js";

class CartManager {
  static lastId = 0;
  constructor(path) {
    this.carts = this.readFile();
    this.path = path;
  }

  async addCart() {
    const allCarts = await this.readFile();
    const cart = {
      id: ++CartManager.lastId,
      products: [],
    };
    allCarts.push(cart);
    await this.saveFile(allCarts);
    return { status: true, message: "Cart created succesfully" };
  }

  async getCartById(id) {
    const allCarts = await this.readFile();
    const cart = allCarts.find((cart) => cart.id === id);
    if (!cart)
      return { status: false, message: `Cart with id ${id} not found` };
    return { status: true, cart: cart };
  }

  async addProductToCartWithId(idCart, idProduct, quantity) {
    const allCarts = await this.readFile();
    const productIdExists = await getProductById(idProduct);
    if (!productIdExists)
      return { status: false, message: "Product not found" };
    const addProduct = allCarts.map((cart) => {
      if (cart.id === idCart) {
        const product = cart.products.find(
          (product) => product.id === idProduct
        );
        if (product) {
          product.quantity = product.quantity + quantity;
        } else {
          cart.products.push({ id: idProduct, quantity: 1 });
        }
      }
      return cart;
    });
    await this.saveFile(addProduct);
    return {
      status: true,
      message: "Product added to cart successfully",
    };
  }

  async readFile() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const arrayResponse = JSON.parse(response);
      return arrayResponse;
    } catch (error) {
      console.log(error);
    }
  }

  async saveFile(array) {
    try {
      await fs.writeFile(this.path, JSON.stringify(array, null, 2));
    } catch (error) {
      console.log(error);
    }
  }
}

const cartManager = new CartManager("./src/models/carts.json");

export async function addCart() {
  const response = await cartManager.addCart();
  return response;
}

export async function getCartWithId(id) {
  return await cartManager.getCartById(id);
}

export async function addProductToCartWithId(idCart, idProduct, quantity) {
  const response = await cartManager.addProductToCartWithId(
    idCart,
    idProduct,
    quantity
  );
  return response;
}
