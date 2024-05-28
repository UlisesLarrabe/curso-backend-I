import express from "express";
import fs from "fs/promises";

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

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    const isRepeated = this.products.some(
      (productRepeated) => productRepeated.code === code
    );
    if (isRepeated) {
      console.error("El codigo del producto esta repetido");
      return;
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
    const allProducts = await this.getProducts();
    const productsUpdated = allProducts.map((product) =>
      product.id === id ? { ...product, ...data, id: product.id } : product
    );
    await this.saveFile(productsUpdated);
    return productsUpdated;
  }

  async deleteProduct(id) {
    const allProducts = await this.getProducts();
    const productsUpdated = allProducts.filter((product) => product.id !== id);
    await this.saveFile(productsUpdated);
    return productsUpdated;
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

const addProduct = async (product) => {
  await productManager.addProduct(product);
};

const getProducts = async () => {
  const products = await productManager.getProducts();
  return products;
};

const getProductById = async (id) => {
  const product = await productManager.getProductById(id);
  if (product) {
    return product;
  } else {
    return { error: "Producto no encontrado" };
  }
};

const updateProduct = async (id, data) => {
  const productsUpdated = await productManager.updateProduct(id, data);
  console.log(productsUpdated);
};

const deleteProduct = async (id) => {
  const productsUpdated = await productManager.deleteProduct(id);
  console.log(productsUpdated);
};

const app = express();

app.get("/products", async (req, res) => {
  const products = await getProducts();
  const { limit } = req.query;
  if (limit) {
    const productsSliced = products.slice(0, limit);
    return res.send(productsSliced);
  }
  return res.send(products);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await getProductById(parseInt(id));
  res.send(product);
});

app.listen(8080, () => {
  console.log("Escuchando en http://localhost:8080");
});
