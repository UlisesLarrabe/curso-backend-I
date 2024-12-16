export class MemoryDao {
  constructor() {
    this.data = [];
  }

  async getAllProducts() {
    console.log("memory");
    return await this.data;
  }

  async paginate() {
    console.log("memory");
    return await this.data;
  }

  async getById(id) {
    return await this.data.find((product) => product.id === id);
  }

  async createProduct(product) {
    this.data.push(product);
    return await product;
  }

  async create(product) {
    this.data.push(product);
    return await product;
  }

  async update(id, product) {
    const index = this.data.findIndex((product) => product.id === id);
    this.data[index] = product;
    return await product;
  }

  async delete(id) {
    const index = this.data.findIndex((product) => product.id === id);
    this.data.splice(index, 1);
    return await { message: "Product deleted" };
  }
}
