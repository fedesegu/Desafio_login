import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  thumbnails: [
    {
      type: String,
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
});

productsSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model("Products", productsSchema);