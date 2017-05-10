const http = require('http'),
      req = require('request'),
      Promise = require('bluebird'),
      default_resp = require('./default_resp.json')
      imgur = require('./sources/imgur.js')
      async = require('async')

var port = 3000
if (process.argv.length > 2) {
  port = process.argv[2]
}

var sources = initSources()

const requestHandler = function (request, response) {
  console.log(request.method, " on ", request.url, " from ", request.connection.remoteAddress)
  if(request.method == "POST") {
    var body = "";
    request.on('data', function (chunk) {
      body += chunk;
    });
    request.on('end', function () {
      var contents = getContents(body)
      var fullUrl = decodeURIComponent(contents.response_url)
      picResponse(decodeURIComponent(contents.text)).then(function(pic){
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

function picResponse(terms_concat) {
  var terms = terms_concat.split('+')
  var totalPics = 1
  if (terms.length > 0 && !isNaN(Number(terms[0]))){
    totalPics = terms.shift()
    console.log("Grabbing ", totalPics, "for terms ", terms)
  }
  return getOptions(terms).then(function(options){
    var pic = selectRandom(options)
    var response = {
      "response_type": "in_channel",
      "text":pic
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
  return [new imgur.Imgur()]
}

function selectRandom(options){
  var total = options.length
  var optionIndex = Math.floor(Math.random() * total)
  return options[optionIndex]
}
