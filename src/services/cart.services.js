import CartAccessMongo from "../models/cart.dao.js";
import ProductModel from "../models/product.model.js";
import TicketModel from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";
import Services from "./services.js";
import { transport } from "../utils/transportEmai.js";

const cartDao = new CartAccessMongo();

export default class CartService extends Services {
  constructor() {
    super(cartDao);
  }

  async addCart() {
    try {
      const newCart = await this.dao.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.dao.getPopulateCartById(id);
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductToCartWithId(idCart, idProduct, quantity) {
    try {
      const response = await this.dao.addProductToCartWithId(
        idCart,
        idProduct,
        quantity
      );
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProductFromCart(idCart, idProduct) {
    try {
      const response = await this.dao.deleteProductFromCart(idCart, idProduct);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addArrayProducts(idCart, products) {
    try {
      products.forEach(async (product) => {
        await this.addProductToCartWithId(
          idCart,
          product._id,
          product.quantity
        );
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProductQuantity(idCart, idProduct, quantity) {
    try {
      const response = await this.dao.updateProductQuantity(
        idCart,
        idProduct,
        quantity
      );
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAllProducts(idCart) {
    try {
      const response = await this.dao.deleteAllProducts(idCart);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async endPurchaseOfCart(idCart, emailUser) {
    try {
      const cart = await this.getCartById(idCart);
      const products = cart.products;
      let total = 0;
      let productsWithoutStock = [];

      const productPromises = products.map(async (product) => {
        const productDB = await ProductModel.findById(
          product.product._id
        ).lean();
        if (productDB.stock >= product.quantity) {
          total += productDB.price * product.quantity;
          await ProductModel.findByIdAndUpdate(productDB._id, {
            stock: productDB.stock - product.quantity,
          });
        } else {
          productsWithoutStock.push({
            product: productDB._id,
            quantity: product.quantity,
          });
        }
      });

      await Promise.all(productPromises);

      if (total === 0) {
        return { data: "Cart is empty" };
      }

      if (productsWithoutStock.length > 0) {
        await this.update(idCart, { products: productsWithoutStock });
        return {
          data: "Not enough stock for this products",
          products: productsWithoutStock,
        };
      }

      await TicketModel.create({
        purchase_datetime: new Date(),
        amount: total,
        purchaser: emailUser,
        code: uuidv4(),
      });
      await this.update(idCart, { products: [] });
      await transport.sendMail({
        from: "CoderMail <larrabeulises@gmail.com>",
        to: emailUser,
        subject: "Purchase Update",
        html: `
        <div>
          <h1>Hi!</h1>
          <p>Just to let you remind that your purchase has been approved! Greetings.</p>
        </div>
        `,
        attachments: [],
      });
      return { data: "Purchased!" };
    } catch (error) {
      throw new Error(error);
    }
  }
}
