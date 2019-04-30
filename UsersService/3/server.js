const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const formidable = require('formidable');
const sendJson = require('send-data/json');
const querystring = require('querystring');

const form = new formidable.IncomingForm();
form.uploadDir = './public';
form.keepExtensions = true;


const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
};

const HEADERS = {
  CONTENT_TYPE: 'content_type',
  CONTENT_LENGTH: 'content_length',
  USER_AGENT: 'user_agent',
};

const server = http.createServer((req, res) => {
  if (req.method === METHODS.GET) {
    const {
      pathname,
      query,
    } = url.parse(req.url);
    if (pathname === '/user') {
      const params = querystring.parse(query);
      const userFolder = path.join(__dirname, 'data', params.q);
      if (!fs.existsSync(userFolder)) {
        res.statusCode = 404;
        res.end('File not found');
      }
      return fs.readFile(path.join(userFolder, 'user.json'), (err, data) => {
        if (err) {
          res.statusCode = 500;
          return res.end('Internal server error');
        }
        const {
          age,
          country,
          city,
          name,
          picture,
        } = JSON.parse(data);
        return res.end(`<html>
                  <body>
                    <h1>${name}</h1>
                    <h3>age: ${age}</h3>
                    <h3>country: ${country}</h3>
                    <h3>city: ${city}</h3>
                    <img src="/${picture}"/>
                  </body>
                </html>`);
      });
    }
    const file = path.join(__dirname, 'public', pathname);
    if (fs.existsSync(file)) {
      fs.readFile(file, (err, data) => {
        if (err) {
          res.statusCode = 500;
          return res.end('Internal server error');
        }
        res.setHeader(
          HEADERS.CONTENT_TYPE,
          mime.getType(file),
        );
        return res.end(data);
      });
    } else {
      res.statusCode = 404;
      res.end('File not found');
    }
  } else if (req.method === METHODS.POST) {
    form.parse(req, (err, fields, {
      picture,
    }) => {
      if (err) {
        res.statusCode = 500;
        return res.end('Internal server error');
      }

      const userFolder = path.join(__dirname, 'data', fields.name);
      if (fs.existsSync(userFolder)) {
        res.statusCode = 400;
        return res.end('User already exists');
      }

      fs.mkdirSync(userFolder);
      return fs.writeFile(path.join(userFolder, 'user.json'), JSON.stringify({
        ...fields,
        picture: picture.path.replace('public/', ''),
      }), (err) => {
        if (err) {
          res.statusCode = 500;
          return res.end('Internal server error');
        }
        return sendJson(req, res, {
          user: fields.name,
        });
      });
    });
  }
});

const port = 8067;

server.listen(port, '127.0.0.1');
console.log(`Server running on 127.0.0.1:${port}`);