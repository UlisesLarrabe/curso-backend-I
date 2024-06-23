import fs from "fs/promises";

class ProductManager {
  static lastId = 0;

  constructor(path) {
    this.products = this.readFile();
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
    const allProducts = await this.getProducts();
    const isRepeated = allProducts.some(
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
      thumbnail: thumbnail ?? [],
      code,
      stock,
    };
    allProducts.push(product);
    await this.saveFile(allProducts);
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

const productManager = new ProductManager("./src/models/products.json");

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

export default ProductManager;
