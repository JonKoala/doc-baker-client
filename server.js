const config = require('config')
const handler = require('serve-handler')
const http = require('http')

const server = http.createServer((req, res) => {
  return handler(req, res, {
    public: 'dist',
    rewrites: [ { source: '*/*', destination: '/index.html' } ]
  })
})

server.listen(config.get('server.port'))
