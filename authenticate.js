function authenticate(req, res, next){
    console.log('logging ...');
    next()
}
module.exports = authenticate;