const express = require("express");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const sendJson = require("send-data/json");
const content = require("content");
const form = new formidable.IncomingForm();

const PUBLIC_FOLDER = "public";
const DATA_FOLDER = "data";

form.uploadDir = path.join(__dirname, PUBLIC_FOLDER);
form.keepExtensions = true;

const app = express();
app.use(express.static(PUBLIC_FOLDER));
app.use((req, res, next) => {
  if (
    req.method === "POST" &&
    content.type(req.headers["content-type"]).mime === "multipart/form-data"
  ) {
    return form.parse(req, (err, fields, files) => {
      if (err) {
        res.statusCode = 400;
        return res.end("Invalid data");
      }
      req.fields = fields;
      req.files = files;

      next();
    });
  }
  next();
});

app.post("/user", (req, res) => {
  const {
    fields,
    files
  } = req;
  const userFolder = path.join(__dirname, DATA_FOLDER, fields.name);
  if (fs.existsSync(userFolder)) {
    res.statusCode = 400;
    return res.end("User already exists");
  }

  fs.mkdirSync(userFolder);
  return fs.writeFile(
    path.join(userFolder, "user.json"),
    JSON.stringify({
      ...fields,
      picture: files.picture.path.replace(`${PUBLIC_FOLDER}/`, "")
    }),
    err => {
      if (err) {
        res.statusCode = 500;
        return res.end("Internal server error");
      }
      return sendJson(req, res, {
        user: fields.name
      });
    }
  );
});

app.get("/user", (req, res) => {
  const dataFolder = path.join(__dirname, DATA_FOLDER);
  fs.readdir(dataFolder, (err, files) => {
    let users = "<html><body><ul>";
    for (const file of files) {
      const userDataFile = path.join(dataFolder, file, "user.json");
      if (fs.existsSync(userDataFile)) {
        users += `<li>${file}</li>`;
      }
      users += "</ul></body></html>";
    }
    return res.end(users);
  });
});

const port = 8222;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});