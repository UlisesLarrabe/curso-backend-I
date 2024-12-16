import ProductAccessmongo from "../models/product.dao.js";
import MongoSingleton from "../singleton/mongo.singleton.js";
import { MemoryDao } from "./memory/memory.persistence.js";

let ProductDao = null;

const persistence = process.argv[2];

switch (persistence) {
  case "--mongo":
    new MongoSingleton();

    ProductDao = new ProductAccessmongo();
    break;
  case "--memory":
    ProductDao = new MemoryDao();
    break;
  default:
    ProductDao = new MemoryDao();
    break;
}

export { ProductDao };
