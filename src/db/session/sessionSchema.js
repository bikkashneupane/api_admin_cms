import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    accessJWT: {
      type: String,
      required: true,
    },
    associate: {
      type: String,
      default: "",
    },
  },
  {
    timeStamps: true,
  }
);

export default mongoose.model("Session", schema);
