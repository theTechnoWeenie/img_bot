const http = require('http')
const port = 3000

const requestHandler = function (request, response) {
  if(request.method == "POST") {
    console.log("POST received to ", request.url)
    console.log(request.body)
  }
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, function (err) {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

//http://104.197.219.228:8080
