import mongoose from "mongoose";

const listSchema = mongoose.Schema({
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
});

const List = mongoose.model("List", listSchema);

export default List;
