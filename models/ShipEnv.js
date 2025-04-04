import mongoose from "../lib/mongodb";

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    street1: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    carrier: {
      type: String,
      default: null,
    },
    offer_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "ShipEnv", // Explicitly set the collection name here
  }
);

// Create the model
const ShipEnv =
  mongoose.models.ShipEnv || mongoose.model("ShipEnv", addressSchema);

console.log("Collection name:", ShipEnv.collection.collectionName);

export default ShipEnv;