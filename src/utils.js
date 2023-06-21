import fs from "fs";
import url from "url";

import { useAuth } from "./api/auth.js";

export function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      serveStaticFile(res, "./views/404.html", "text/html");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

export function servePublicFiles(req, res) {
  const filePath = `./views${req.url}`;
  const extension = req.url.split(".").pop();
  const contentType =
    {
      svg: "image/svg+xml",
      css: "text/css",
      js: "text/javascript",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      html: "text/html",
    }[extension] || "text/plain";
  serveStaticFile(res, filePath, contentType);
}

export function getRouteHandler(routes, req) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  let pathParams = {};

  for (const route in routes) {
    const routePathSegments = route.split("/");
    const requestPathSegments = path.split("/");

    if (routePathSegments.length === requestPathSegments.length) {
      let match = true;

      for (let i = 0; i < routePathSegments.length; i++) {
        if (routePathSegments[i].startsWith(":")) {
          const paramName = routePathSegments[i].substring(1);
          pathParams[paramName] = requestPathSegments[i];
        } else if (routePathSegments[i] !== requestPathSegments[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return routes[route];
      }
    }
  }
}

export function getPathParams(routes, req) {
  const parsedUrl = url.parse(req.url, true);
  const pathSegments = parsedUrl.pathname.split("/");
  const pathParams = {};

  const routeSegments = Object.keys(routes);
  for (const segment of routeSegments) {
    const routeSegmentsArr = segment.split("/");
    if (routeSegmentsArr.length === pathSegments.length) {
      let isMatch = true;
      for (let i = 0; i < routeSegmentsArr.length; i++) {
        if (routeSegmentsArr[i].startsWith(":")) {
          const paramName = routeSegmentsArr[i].substring(1);
          pathParams[paramName] = pathSegments[i];
        } else if (routeSegmentsArr[i] !== pathSegments[i]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        break;
      }
    }
  }

  return pathParams;
}

export function route({ method, auth }, handler) {
  return (req, res) => {
    if (req.method != method.toUpperCase()) {
      return res.send(400, `method ${method} not allowed`);
    }
    if (auth) {
      useAuth(handler)(req, res);
    }
    handler(req, res);
  };
}
