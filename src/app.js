import dotenv from "dotenv";

dotenv.config();

import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import "./database.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./strategies/current.js";
import routes from "./routes/index.js";
import ProductService from "./services/product.services.js";

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("src/public"));
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

initializePassport();
app.use(passport.initialize());
app.use(cookieParser(process.env.SECRET_KEY));
app.use("/", viewsRouter);
app.use("/", routes);

const httpServer = app.listen(8080, () => {
  console.log("Listening in http://localhost:8080");
});

const productManager = new ProductService();

const io = new Server(httpServer);
io.on("connection", async (socket) => {
  const products = await productManager.getAllProducts();
  socket.emit("products", products.docs);
  socket.on("deleteProduct", async (id) => {
    await productManager.delete(id);
    const products = await productManager.getAllProducts();
    io.sockets.emit("products", products.docs);
  });
  socket.on("addProduct", async (product) => {
    await productManager.createProduct(product);
    const products = await productManager.getAllProducts();
    io.sockets.emit("products", products.docs);
  });
});
