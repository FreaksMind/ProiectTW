import fs from "fs";

const serveStaticFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
};

const servePublicFiles = (req, res) => {
  const filePath = `./public${req.url}`;
  const extension = req.url.split('.').pop();
  const contentType = {
    css: 'text/css',
    js: 'text/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    html: "text/html"
  }[extension] || 'text/plain';
  serveStaticFile(res, filePath, contentType);
};

export { serveStaticFile, servePublicFiles }
