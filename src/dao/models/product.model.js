import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  thumbnails: [String],
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

schema.plugin(paginate);

const ProductModel = mongoose.model("products", schema);

export default ProductModel;
