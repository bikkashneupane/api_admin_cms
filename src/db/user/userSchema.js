import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    refreshJWT: {
      type: String,
      default: "",
    },
  },
  {
    timeStamps: true,
  }
);

export default mongoose.model("Admin", schema);
