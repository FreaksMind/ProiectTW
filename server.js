import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 5050;

const basePath = __dirname;

http.createServer((req, res) => {
  const stream = fs.createReadStream(path.join(`${basePath}/public/${req.url}`));

  stream.on("error", () => {
    res.writeHead(404);
    res.end();
  });

  stream.pipe(res);

}).listen(port, () => {
  console.log(`listening on port ${port}...`)
});
