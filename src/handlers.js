import fs from "fs";

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
