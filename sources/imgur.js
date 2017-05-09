function Imgur(){
    this.key = "totally legit key"
    this.api_url = "https://api.imgur.com/3/"
    this.search = function(terms) {
        return new Promise(function(resolve, reject){
            resolve(["http://i.imgur.com/hr3SX1Z.png"])
        })
    }
}

module.exports = {
    Imgur: Imgur
}
