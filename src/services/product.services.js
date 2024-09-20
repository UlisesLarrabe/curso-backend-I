import ProductAccessmongo from "../models/product.dao.js";
import Services from "./services.js";

const productDao = new ProductAccessmongo();
export default class ProductService extends Services {
  constructor() {
    super(productDao);
  }

  getAllProducts = async (category, limit, page, sort) => {
    try {
      const query = category ? { category: category.toLowerCase() } : {};
      const options = {
        limit,
        page,
        sort: sort ? { price: sort } : {},
      };
      const data = await productDao.paginate(query, options);
      let products = data.docs.map((product) => {
        const { _id, ...rest } = product;
        return rest;
      });
      return { docs: products, ...data };
    } catch (error) {
      throw new Error(error);
    }
  };

  createProduct = async (product) => {
    try {
      const { title, description, price, code, stock, status, category } =
        product;
      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !stock ||
        !status ||
        !category
      ) {
        throw new Error("All fields are necessary");
      }
      const productWithSameCode = await productDao.getByCode(code);

      if (productWithSameCode) {
        throw new Error("Product already exists");
      }
      const data = await productDao.create(product);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };
}
