
function log(req, res, next){
  console.log('Logging');
  next()
}

// commonjs export
module.exports = log

// es6 export
// export default log