const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  HEAD: "HEAD"
};

const HEADERS = {
  CONTENT_TYPE: "content_type",
  CONTENT_LENGTH: "content_length",
  USER_AGENT: "user_agent"
};

const server = http.createServer((req, res) => {
  if (req.method === METHODS.GET) {
    const { pathname } = url.parse(req.url);
    const file = path.join(__dirname, "public", pathname);
    if (fs.existsSync(file)) {
      return fs.readFile(file, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end("Internal server error");
        }
        res.setHeader(HEADERS.CONTENT_TYPE, mime.getType(file));
        return res.end(data);
      });
    } else {
      res.statusCode = 404;
      return res.end("File not found");
    }
  }
});

const port = 8067;

server.listen(port, "127.0.0.1");
console.log(`Server running on 127.0.0.1:${port}`);
