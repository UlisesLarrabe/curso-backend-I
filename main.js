const fs = require("fs").promises;

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

const returnProducts = async () => {
  const products = await productManager.getProducts();
  console.log(products);
};

const getProductById = async (id) => {
  const product = await productManager.getProductById(id);
  console.log(product);
};

const updateProduct = async (id, data) => {
  const productsUpdated = await productManager.updateProduct(id, data);
  console.log(productsUpdated);
};

const deleteProduct = async (id) => {
  const productsUpdated = await productManager.deleteProduct(id);
  console.log(productsUpdated);
};

// addProduct({
//   title: "Producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc123",
//   stock: 25,
// });

// addProduct({
//   title: "Producto prueba 2",
//   description: "Este es un producto prueba 2",
//   price: 300,
//   thumbnail: "Sin imagen",
//   code: "abc124",
//   stock: 35,
// });

// updateProduct(2, { title: "Producto actualizado" });

deleteProduct(2);
