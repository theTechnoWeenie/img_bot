function Static() {
    this.search = function(terms){
        return new Promise(function(resolve, reject){
            resolve([{"source":"static", "pic": "http://i.imgur.com/4AjVHdR.png"}])
        })
    }
}

module.exports = {
    Static: Static
}