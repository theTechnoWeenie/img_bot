const http = require('http'),
      req = require('request'),
      Promise = require('bluebird'),
      default_resp = require('./default_resp.json'),
      imgur = require('./sources/imgur.js'),
      giphy = require('./sources/giphy.js'),
      async = require('async'),
      path = require('path'),
      fs = require('fs')

var port = 3000
if (process.argv.length > 2) {
  port = process.argv[2]
}

var sources = initSources()

const requestHandler = function (request, response) {
  if(request.method == "POST") {
    var body = "";
    request.on('data', function (chunk) {
      body += chunk;
    });
    request.on('end', function () {
      var contents = getContents(body)
      var fullUrl = decodeURIComponent(contents.response_url)
      picResponse(decodeURIComponent(contents.text), request).then(function(pic){
        req.post(fullUrl, {body:pic, json:true},function(err,httpResponse,body){
          if(err || httpResponse.statusCode >= 300){
            console.log("Errors replying:")
            console.log(err)
            console.log(httpResponse.statusCode)
            console.log(body)
          }
        })
      })
    })
  }
  if(request.url.includes("/images/")) {
    return sendStaticImages(response, request)
  }
  console.log(request.method, " on ", request.url)
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(default_resp))
}

const server = http.createServer(requestHandler)

server.listen(port, function (err) {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log('server is listening on', port)
})

function getContents(body) {
  var parts = body.split('&')
  var contents = {}
  parts.forEach(function(item) {
    var pair = item.split("=")
    contents[pair[0]] = pair[1]
  }, this);
  return contents
}

//NOTE: the request object is here because we need to attribute giphy images... kinda dirty.
function picResponse(terms_concat, request) {
  var terms = terms_concat.split('+')
  return getOptions(terms).then(function(options){
    var picData = selectRandom(options)
    var pic = picData.pic
    var response = {
      "response_type": "in_channel",
      "text":picData.pic
    }
    if(picData.source == "giphy"){
      response.attachments = [
        {
          "fallback":"Powered by " + picData.source,
          "image_url": "http://" + request.headers.host + "/images/poweredByGiphy.png"          
        }
      ] 
    }
    return response
  })
}

function getOptions(terms){
  return new Promise(function(resolve, reject){
    async.concat(sources, function(source, callback){
      source.search(terms).then(function(results){
        callback(null, results)
      })
    }, function(err, results){
      if(err) {
        console.log("Error getting images from sources:", err)
        return reject(err)
      }
      resolve(results)
    })
  })
}

function initSources(){ 
  return [new imgur.Imgur(), new giphy.Giphy()]
}

function selectRandom(options){
  var total = options.length
  var optionIndex = Math.floor(Math.random() * total)
  return options[optionIndex]
}

function sendStaticImages(response, request) {
  response.statusCode = 200
  var fileLoc = path.resolve("./")
  fileLoc = path.join(fileLoc, request.url)
  return fs.readFile(fileLoc, function(err, data){
    if(err) {
      res.writeHead(404, 'Not Found');
      res.write('404: File Not Found!');
      return res.end();
    }
    response.write(data)
    return response.end();
  })
}