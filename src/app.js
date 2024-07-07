import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import "./database.js";
import ProductManager from "./dao/db/product-manager-db.js";

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

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Listening in http://localhost:8080");
});

const productManager = new ProductManager();

const io = new Server(httpServer);
io.on("connection", async (socket) => {
  console.log("Client connected");
  socket.emit("products", await productManager.getProducts());
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    io.sockets.emit("products", await productManager.getProducts());
  });
  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    io.sockets.emit("products", await productManager.getProducts());
  });
});
