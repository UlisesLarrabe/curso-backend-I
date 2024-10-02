import mongoose from "mongoose";

const schema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const CartModel = mongoose.model("carts", schema);

export default CartModel;
