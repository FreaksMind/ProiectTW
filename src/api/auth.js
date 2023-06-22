import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userSchema.js";
import { route } from "../utils.js";

function generateJWT(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 86400 },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export const login = route({ method: "post" }, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send(400, { message: "fill up all fields" });
  }
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

      generateJWT(payload)
        .then((token) => {
          return res.send(200, {
            message: "success",
            token: "Bearer " + token,
          });
        })
        .catch((err) => {
          return res.send(400, { message: "error generating jwt " + err });
        });
    });
  });
});

export const register = route({ method: "post" }, async (req, res) => {
  const { username, password } = req.body;

  const usernameTaken = await User.findOne({ username });

  if (!username || !password) {
    return res.send(400, { message: "fill up all fields" });
  }

  if (usernameTaken) {
    return res.send(400, { message: "username taken" });
  }

  if (!validatePassword(password)) {
    return res.send(400, {
      message: "password must have between 8 and 16 characters",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
  });

  newUser.save();

  const payload = {
    id: newUser._id,
    username: newUser.username,
  };

  generateJWT(payload)
    .then((token) => {
      return res.send(200, {
        message: "success",
        token: "Bearer " + token,
      });
    })
    .catch((err) => {
      return res.send(400, { message: "error generating jwt " + err });
    });
});

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

export function useAuth(handler) {
  return (req, res) => {
    try {
      verifyJWT(req);
      handler(req, res);
    } catch (error) {
      return res.send(400, {
        message: "you are not authenticated",
      });
    }
  };
}

function validatePassword(password) {
  if (password.length > 16 || password.length < 8) {
    return false;
  } else {
    return true;
  }
}
