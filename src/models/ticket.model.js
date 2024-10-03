import { model, Schema } from "mongoose";
const schema = new Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const TicketModel = model("tickets", schema);

export default TicketModel;
