const path = require('path')
const os = require('os')
const fs = require('fs')
const jsonServer = require('json-server')
const server = jsonServer.create()

const middlewares = jsonServer.defaults()

const dbFilename = path.join(os.tmpdir(), 'db.json')

// 判断一下 dbFilename 是否存在，如果不存在才创建
if (!fs.existsSync(dbFilename)) {
  fs.writeFileSync(dbFilename, JSON.stringify({
    "posts": [
      { "id": 1, "title": "json-server", "author": "typicode", "apiId": "server" },
      { "id": 2, "title": "iis", "author": "ms", "apiId": "server" }
    ],
    "comments": [
      { "id": 1, "body": "some comment", "postId": 1, "apiId": "server" }
    ],
    "profile": { "name": "typicode", "apiId": "server" }
  }))
}

const router = jsonServer.router(dbFilename)
server.use(middlewares)
server.use(router)

module.exports = server