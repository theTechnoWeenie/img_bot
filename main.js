const http = require('http')
const default_resp = require('./default_resp.json')
var port = 3000
if (process.argv.length > 2) {
  port = process.argv[2]
}

const requestHandler = function (request, response) {
  if(request.method == "POST") {
    console.log("POST received to ", request.url)
    var body = "";
    request.on('data', function (chunk) {
      body += chunk;
    });
    request.on('end', function () {
      var contents = getContents(body)
      console.log(contents.text)
      console.log(decodeURIComponent(contents.response_url))
      var fullUrl = decodeURIComponent(contents.response_url)
      setTimeout(function(){
        var postBody = JSON.stringify(picResponse())
        console.log(postBody)
        var contentLength = Buffer.byteLength(postBody)
        var path = fullUrl.split("hooks.slack.com")
        var option = {
          host: "https://hooks.slack.com",
          port: 443,
          path: path[1],
          method : 'POST',
          headers : {
            'Content-Type': 'application/json',
            'Content-Length': contentLength
          }
        }
        console.log(option)
        var postReq = http.request(option, function(res){
          console.log("Status from sending pic: ")
          console.log(res.statusCode)
        })
      }, 1000)
    })
  }
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(default_resp))
}

function getContents(body) {
  var parts = body.split('&')
  var contents = {}
  parts.forEach(function(item) {
    var pair = item.split("=")
    contents[pair[0]] = pair[1]
  }, this);
  return contents
}

function picResponse() {
  var pic = "http://i.imgur.com/hr3SX1Z.png"
  var response = {
    "response_type": "in_channel",
    "text":pic
  }
  return response
}

const server = http.createServer(requestHandler)

server.listen(port, function (err) {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log('server is listening on', port)
})

//http://104.197.219.228:8080
