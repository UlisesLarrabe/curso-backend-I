import ProductService from "../services/product.services.js";
import { createResponse } from "../utils/createResponse.js";
import Controllers from "./controllers.js";

const productService = new ProductService();

export default class ProductController extends Controllers {
  constructor() {
    super(productService);
  }

  getAllProducts = async (req, res, next) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const category = req.query.category;
    const sort = req.query.sort;
    try {
      const data = await this.service.getAllProducts(
        category,
        limit,
        page,
        parseInt(sort)
      );
      return createResponse(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const data = await this.service.createProduct(req.body);
      return createResponse(res, 201, data);
    } catch (error) {
      next(error);
    }
  };
}
