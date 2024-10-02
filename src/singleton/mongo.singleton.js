import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default class MongoSingleton {
  static #instance;
  constructor() {
    mongoose.connect(process.env.MONGO_URL);
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Base de datos inicializada");

      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    console.log("Base de datos inicializada");
    return this.#instance;
  }
}

MongoSingleton.getInstance();
