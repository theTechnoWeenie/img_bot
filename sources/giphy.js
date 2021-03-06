var secrets = require("../.secrets.json"),
    rp = require('request-promise')

function Giphy() {
    this.name = "Giphy"
    this.api_key = secrets.giphyKey
    this.url = "http://api.giphy.com/v1/gifs/translate"

    this.search = function(terms){
        var options = {
            method: "GET",
            url: this.url + "?s=" + terms + "&api_key=" + this.api_key,
            headers: {
                "Content-type": "application/json"
            }
        }
        return rp(options).then(function(response){
            var imgData = JSON.parse(response)
            if(!imgData.data.images.fixed_height.url){
              console.log("Image link is undefined!")
              console.log(imageData)
            }
            return [{"source":"giphy", "pic": imgData.data.images.fixed_height.url}]
        }, function(err){
          console.log("Error in giphy: ", err)
          return []
        })
    }
}

module.exports = {
    Giphy: Giphy
}
