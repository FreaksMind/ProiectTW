import http from "http";
import mongoose from "mongoose";

import { servePublicFiles, serveStaticFile } from "./handlers.js";
import apiRouter from "./api/router.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = 5050;

const routes = {
  "/": (req, res) => {
    serveStaticFile(res, "./views/index.html", "text/html");
  },
  "/login": (req, res) => {
    serveStaticFile(res, "./views/login.html", "text/html");
  },
  ...apiRouter,
};

const server = http.createServer((req, res) => {
  const routeHandler = routes[req.url];

  if (routeHandler) {
    res.send = (statusCode, data = {}) => {
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        // TODO: handle parse errors
        const data = JSON.parse(body);
        req.body = data;

        routeHandler(req, res);
      });
    } else {
      routeHandler(req, res);
    }
  } else {
    servePublicFiles(req, res);
  }
});

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`listening on ${PORT} ...`);
    });
  })
  .catch((err) => {
    console.log("error connecting to mongo db", err);
  });
