const { spawn } = require('child_process')
const config = require('config')

var port = config.get('server.port')
const child = spawn('cmd', ['/c', `npm run server -- -g -p ${port}`], { stdio: 'inherit' })
