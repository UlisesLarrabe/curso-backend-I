import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://Alejandrou:ulises2004@cluster0.pgv74zu.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });
