import ProductController from "../controllers/product.controller.js";
import CustomRouter from "./customRouter.js";

const productController = new ProductController();

export default class ProductsRouterCustom extends CustomRouter {
  init() {
    this.get("/", ["PUBLIC"], productController.getAllProducts);
    this.get("/:id", ["PUBLIC"], productController.getById);
    this.post("/", ["ADMIN"], productController.createProduct);
    this.put("/:id", ["ADMIN"], productController.update);
    this.delete("/:id", ["ADMIN"], productController.delete);
  }
}
