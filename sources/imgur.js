var secrets = require("../.secrets.json"),
    rp = require('request-promise')
function Imgur(){
    this.key = "totally legit key"
    this.name = "Imgur"
    this.search_url = "https://api.imgur.com/3/gallery/search/?q="
    this.image_url = "https://api.imgur.com/3/image/"
    this.client_token = secrets.imgurClientID
    //Image link is found in data[?].link
    this.search = function(terms) {
        var self = this
        var options = self.getOptions(this.search_url, terms)
        return rp(options).then(function(body){
            var info = JSON.parse(body)
            var filtered = info.data.filter(function(datum){
                return datum.nsfw === false
            })
            if(filtered.length == 0) {
                console.log("Imgur found nothing. :(")
                return []
            }
            //TODO pick something more random than the first result?
            var imgHash = filtered[0].cover || filtered[0].id
            self.imgSource = filtered[0].link
            var imageOptions = self.getOptions(self.image_url, [imgHash])
            return rp(imageOptions).then(function(imageData){
                imageData = JSON.parse(imageData)
                if(!imageData.data.link) {
                  console.log(imageData.data)
                }
                if(self.imgSource.includes("i.imgur.com")){
                  var imgFile = self.imgSource.split("/").pop()
                  self.imgSource = "https://imgur.com/" + imgFile.slice(0,-4)
                }
                return [{"source": "imgur","pic":imageData.data.link, "post": self.imgSource}]
            })
        })
    }

    this.getOptions = function(url, tokens){
      var encoded = encodeURIComponent(tokens.join(" "))
        return {
            method: "GET",
            url: url + encoded,
            headers: {
                "Authorization": "Client-ID " + this.client_token,
                "Content-type": "application/json"
            }
        }
    }
}

module.exports = {
    Imgur: Imgur
}
