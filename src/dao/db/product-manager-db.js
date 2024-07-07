import ProductModel from "../models/product.model.js";

class ProductManager {
  async getProducts() {
    try {
      const response = await ProductModel.find().lean();
      return response;
    } catch (error) {
      return error;
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
        return {
          status: "error",
          message: "All fields are required",
        };
      }
      const allProducts = await this.getProducts();
      const isRepeated = allProducts.some(
        (productRepeated) => productRepeated.code === code
      );

      if (isRepeated) {
        return {
          status: "error",
          message: "The product's code must be unique",
        };
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
        return null;
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
