import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  if (req.method != "POST") {
    return res.send(400);
  }

  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.send(400, { message: "username not found" });
    }

    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return res.send(400, { message: "incorrect password" });
      }

      const payload = {
        id: user._id,
        username: user.username,
      };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 }, (err, token) => {
        if (err) {
          return res.send(400, { message: "erorr generating jwt" });
        }
        return res.send(200, {
          message: "success",
          token: "Bearer " + token,
        });
      });
    });
  });
}

export async function register(req, res) {
  if (req.method != "POST") {
    return res.send(400);
  }

  const { username, password } = req.body;

  const usernameTaken = await User.findOne({ username });

  if (usernameTaken) {
    return res.send({ message: "username taken" });
  }

  // TODO: validate password

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
  });

  newUser.save();

  return res.send(200);
}

function verifyJWT(req) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    throw new Error("Invalid token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };
  } catch (err) {
    throw new Error("Failed to authenticate");
  }
}

export function authenticatedRoute(handler) {
  return (req, res) => {
    try {
      verifyJWT(req);
      handler(req, res);
    } catch (error) {
      return res.send({
        message: "you are not authenticated",
      });
    }
  };
}
