"use strict";

var path = require('path');

var os = require('os');

var fs = require('fs');

var jsonServer = require('json-server');

var server = jsonServer.create();
var middlewares = jsonServer.defaults();
var dbFilename = path.join(os.tmpdir(), 'db.json'); // 判断一下 dbFilename 是否存在，如果不存在才创建

if (!fs.existsSync(dbFilename)) {
  fs.writeFileSync(dbFilename, JSON.stringify({
    "posts": [{
      "id": 1,
      "title": "json-server",
      "author": "typicode",
      "apiId": "server"
    }, {
      "id": 2,
      "title": "iis",
      "author": "ms",
      "apiId": "server"
    }],
    "comments": [{
      "id": 1,
      "body": "some comment",
      "postId": 1,
      "apiId": "server"
    }],
    "profile": {
      "name": "typicode",
      "apiId": "server"
    }
  }));
}

var router = jsonServer.router(dbFilename);
server.use(middlewares);
server.use(router);
module.exports = server;