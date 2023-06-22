import { route } from "../utils.js";
import User from "../models/userSchema.js";
import List from "../models/listSchema.js";

export const getUsers = route(
  { method: "get", auth: true },
  async (req, res) => {
    const users = await User.find({});
    return res.send(200, users);
  }
);

export const deleteUser = route(
  { method: "post", auth: true },
  async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.send(400, { message: "user doesn't exist" });
      }

      await List.deleteMany({ userId: userId });

      return res.send(200);
    } catch (error) {
      return res.send(500, { message: "error deleting user: " + error });
    }
  }
);

//export const addNewUser = route();
