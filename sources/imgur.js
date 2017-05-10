var secrets = require("../.secrets.json"),
    rp = require('request-promise')

function Imgur(){
    this.key = "totally legit key"
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
            var imgHash = filtered[0].cover || filtered[0].id
            var imageOptions = self.getOptions(self.image_url, [imgHash])
            return rp(imageOptions).then(function(imageData){
                imageData = JSON.parse(imageData)
                return [imageData.data.link]
            })
        })
    }
    
    this.getOptions = function(url, tokens){
        return {
            method: "GET",
            url: url + tokens.join("+"),
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
