import ProductModel from "../models/product.model.js";

class ProductManager {
  async getProducts(category, limit, page, sort) {
    try {
      const query = category ? { category: category.toLowerCase() } : {};
      const options = {
        limit,
        page,
        sort: sort ? { price: sort } : {},
      };
      const response = await ProductModel.paginate(query, options);
      let arrayDocs = response.docs.map((product) => {
        const { _id, ...rest } = product;
        return rest;
      });
      return { docs: arrayDocs, ...response };
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProduct(newProduct) {
    try {
      const {
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        img,
        status,
        category,
      } = newProduct;
      console.log(newProduct);
      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !stock ||
        !img ||
        !status ||
        !category
      ) {
        throw new Error("All fields are necessary");
      }
      const { docs: allProducts } = await this.getProducts();
      console.log(allProducts);
      const isRepeated = allProducts.some(
        (productRepeated) => productRepeated.code === code
      );

      if (isRepeated) {
        throw new Error("Product already exists");
      }
      const product = new ProductModel({
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        img,
        status,
        category,
      });
      await product.save();
      return {
        status: "success",
        message: "Product added successfully",
        payload: product,
      };
    } catch (error) {
      return {
        status: "error",
        message: error,
      };
    }
  }

  async getProductById(id) {
    try {
      const product = ProductModel.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      return error;
    }
  }

  async updateProduct(id, data) {
    try {
      const isProductFound = ProductModel.findById(id);
      if (!isProductFound) {
        return { status: "error", message: "Product not found" };
      }
      await ProductModel.findByIdAndUpdate(id, data);
      return {
        status: "success",
        message: "Product updated successfully",
      };
    } catch (error) {
      return { status: "error", message: "Product not found" };
    }
  }

  async deleteProduct(id) {
    try {
      const productDeleted = await ProductModel.findByIdAndDelete(id);
      if (!productDeleted) {
        return { status: "error", message: "Product not found" };
      }
      return { status: "success", message: "Product deleted successfully" };
    } catch (error) {
      return { status: "error", message: "Product not found" };
    }
  }
}

export default ProductManager;
