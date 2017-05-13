// http://api.giphy.com/v1/gifs/translate?s=friday&api_key=dc6zaTOxFJmzC&fmt=html

var secrets = require("../.secrets.json"),
    rp = require('request-promise')

function Giphy() {
    this.api_key = secrets.giphyKey
    this.url = "http://api.giphy.com/v1/gifs/translate"

    this.search = function(terms){

        return new Promise(function(resolve, reject){
            resolve([{"source":"giphy", "pic": "http://media4.giphy.com/media/3o6ozw1zTHtQTsTZqo/200.gif"}])
        })
    }
}

module.exports = {
    Giphy: Giphy
}