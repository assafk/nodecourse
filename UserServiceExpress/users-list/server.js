const express = require("express");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const sendJson = require("send-data/json");
const content = require("content");

const form = new formidable.IncomingForm();
form.uploadDir = "./public";
form.keepExtensions = true;

const app = express();
app.use(express.static("public"));

app.use((req, res, next) => {
  const isForm =
    req.method === "POST" &&
    content.type(req.headers["content-type"]).mime === "multipart/form-data";
  if (!isForm) {
    return next();
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.statusCode = 500;
      return res.end("Internal server error");
    }
    req.fields = fields;
    req.files = files;
    return next();
  });
});

app.post("/user", (req, res) => {
  const {
    files: { picture },
    fields
  } = req;
  const userFolder = path.join(__dirname, "data", fields.name);
  if (fs.existsSync(userFolder)) {
    res.statusCode = 400;
    return res.end("User already exists");
  }

  fs.mkdirSync(userFolder);
  return fs.writeFile(
    path.join(userFolder, "user.json"),
    JSON.stringify({
      ...fields,
      picture: picture.path.replace("public/", "")
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

function renderUser(files, html, callback) {
  if (files.length === 0) {
    return callback(undefined, html);
  }
  const file = files.shift();
  const userDataFile = path.join("./data", file, "user.json");
  fs.readFile(userDataFile, (err, data) => {
    if (err) {
      return callback(err, undefined);
    }
    const { name, age, country, city } = JSON.parse(data);
    html += `<li>
      <h1>${name}</h1>
      <h3>age: ${age}</h3>
      <h3>country: ${country}</h3>
      <h3>city: ${city}</h3>
    </li>`;
    renderUser(files, html, callback);
  });
}

app.get("/user", (req, res) => {
  fs.readdir("./data", (err, files) => {
    if (err) {
      res.status = 500;
      return res.end("System error");
    }
    renderUser(files, "<html><body><h1>USERS!</h1><ul>", (err, html) => {
      if (err) {
        res.status = 500;
        return res.end("System error");
      }
      html += "</ul><body></html>";
      return res.end(html);
    });
  });
});

app.listen(8222, () => console.log("Listening on 8222"));
