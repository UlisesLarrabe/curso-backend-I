import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import "./database.js";
import ProductManager from "./dao/db/product-manager-db.js";
import sessionsRouter from "./routes/sessions.router.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./strategies/current.js";

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
app.use(cookieParser("palabrasupersecreta"));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Listening in http://localhost:8080");
});

const productManager = new ProductManager();

const io = new Server(httpServer);
io.on("connection", async (socket) => {
  const products = await productManager.getProducts();
  socket.emit("products", products.docs);
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.sockets.emit("products", products.docs);
  });
  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    io.sockets.emit("products", products.docs);
  });
});
