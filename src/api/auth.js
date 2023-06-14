import mongoose from "mongoose";
import User from "../models/userSchema.js";

mongoose
  .connect("mongodb+srv://freaks:freaks@cluster0.hcbachu.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

export async function register(req, res) {
  if (req.method === "POST") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const { username, email, password } = JSON.parse(data);
      console.log(username);
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify("email exists"));
    }

    const newUser = new User({ username, email, password });

    await newUser.save();

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify("eccount created"));
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify("error acreating account"));
  }
}

export async function login(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password" };
    }
    if (!password === user.password) {
      return { error: "Invalid email or password" };
    }

    return { message: "Login successful" };
  } catch (error) {
    return { error: "Internal server error" };
  }
}
