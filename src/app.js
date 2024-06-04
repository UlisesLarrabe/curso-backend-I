import express from "express";
import fs from "fs/promises";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

class ProductManager {
  static lastId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async getProducts() {
    const response = await this.readFile();
    return response;
  }

  async addProduct(newProduct) {
    const { title, description, price, thumbnail, code, stock } = newProduct;
    if (!title || !description || !price || !code || !stock) {
      return { status: false, message: "All fields are required" };
    }

    const isRepeated = this.products.some(
      (productRepeated) => productRepeated.code === code
    );
    if (isRepeated) {
      return { status: false, message: "The product's code is repeated" };
    }
    const product = {
      id: ++ProductManager.lastId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);
    await this.saveFile(this.products);
    return { status: true, message: "Product added successfully" };
  }

  async getProductById(id) {
    const allProducts = await this.getProducts();
    const product = allProducts.find((product) => product.id === id);
    if (!product) {
      console.error("Producto no encontrado");
      return;
    }
    return product;
  }

  async updateProduct(id, data) {
    try {
      const allProducts = await this.getProducts();
      const isProductFound = allProducts.some((product) => product.id === id);
      if (!isProductFound) throw new Error("Product not found");
      const productsUpdated = allProducts.map((product) =>
        product.id === id ? { ...product, ...data, id: product.id } : product
      );
      await this.saveFile(productsUpdated);
      return { status: true, message: "Product updated successfully" };
    } catch (error) {
      return { status: false, message: "Product not found" };
    }
  }

  async deleteProduct(id) {
    try {
      const allProducts = await this.getProducts();
      const isProductFound = allProducts.some((product) => product.id === id);
      if (!isProductFound) throw new Error("Product not found");
      const productsUpdated = allProducts.filter(
        (product) => product.id !== id
      );
      await this.saveFile(productsUpdated);
      return { status: true, message: "Product deleted successfully" };
    } catch (error) {
      return { status: false, message: "Product not found" };
    }
  }

  async saveFile(array) {
    try {
      await fs.writeFile(this.path, JSON.stringify(array, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo: ", error);
    }
  }

  async readFile() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const arrayResponse = JSON.parse(response);
      return arrayResponse;
    } catch (error) {
      console.log(`Error al leer el archivo, ${error} `);
    }
  }
}

const productManager = new ProductManager("./products.json");

export const addProduct = async (product) => {
  const result = await productManager.addProduct(product);
  return result;
};

export const getProducts = async () => {
  const products = await productManager.getProducts();
  return { status: true, products };
};

export const getProductById = async (id) => {
  const product = await productManager.getProductById(id);
  if (product) {
    return { status: true, product };
  } else {
    return { status: false, error: "Producto no encontrado" };
  }
};

export const updateProduct = async (id, data) => {
  const productsUpdated = await productManager.updateProduct(id, data);
  return productsUpdated;
};

export const deleteProduct = async (id) => {
  const productsUpdated = await productManager.deleteProduct(id);
  return productsUpdated;
};

class CartManager {
  static lastId = 0;
  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async addCart() {
    const cart = {
      id: ++CartManager.lastId,
      products: [],
    };
    this.carts.push(cart);
    await this.saveFile(this.carts);
    return { status: true, message: "Cart created succesfully" };
  }

  async getCartById(id) {
    const allCarts = await this.readFile();
    const cart = allCarts.find((cart) => cart.id === id);
    if (!cart)
      return { status: false, message: `Cart with id ${id} not found` };
    return { status: true, cart: cart };
  }

  async addProductToCartWithId(idCart, idProduct) {
    const allCarts = await this.readFile();
    const productIdExists = await productManager.getProductById(idProduct);
    if (!productIdExists)
      return { status: false, message: "Product not found" };
    const addProduct = allCarts.map((cart) => {
      if (cart.id === idCart) {
        const product = cart.products.find(
          (product) => product.id === idProduct
        );
        if (product) {
          product.quantity++;
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

const cartManager = new CartManager("./carts.json");

export async function addCart() {
  const response = await cartManager.addCart();
  return response;
}

export async function getCartWithId(id) {
  return await cartManager.getCartById(id);
}

export async function addProductToCartWithId(idCart, idProduct) {
  const response = await cartManager.addProductToCartWithId(idCart, idProduct);
  return response;
}

app.listen(8080, () => {
  console.log("Escuchando en http://localhost:8080");
});
