import mongoose from "mongoose";

const listSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    movies: {
      type: [String],
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);

export default List;
