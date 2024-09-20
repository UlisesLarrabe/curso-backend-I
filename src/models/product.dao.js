import MongoDao from "./dao.js";
import ProductModel from "./product.model.js";

export default class ProductAccessmongo extends MongoDao {
  constructor() {
    super(ProductModel);
  }

  async paginate(query, options) {
    try {
      return await this.model.paginate(query, options);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByCode(code) {
    try {
      return await this.model.findOne({ code });
    } catch (error) {
      throw new Error(error);
    }
  }
}
