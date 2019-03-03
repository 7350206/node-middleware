// to handle set DEBUG env vars
// $export DEBUG=app:needed_workspace
const startUpDebugger = require('debug')('app:startup') // (debug)(when app starts)
const dbDebugger = require('debug')('app:db') // (debug)(db only)
const pug = require('pug')
const helmet = require('helmet')
const config = require('config') //configuration handling config/*.json
// const Joi = require('joi') // input validator

// load posts routes
const home = require('./routes/home')
const posts = require('./routes/posts')

const express = require('express')
const logger = require('./middleware/logger')
const app = express()
const morgan = require('morgan')


// node environments
//process.env.NODE_ENV // if not set - undefined
console.log(`NODE_ENV: ${process.env.NODE_ENV}`); //undefined

//app.get('env') return 'development' by default
console.log(`app: ${app.get('env')}`); //app:development


app.use(express.json()) // parses req.body if json
app.use(express.urlencoded({extended:true})) //key=value&key=value contenttype:x-form-urlencoded
app.use(express.static('public'))
app.use(helmet()) //add lot a headers
// use routes, with this path use this router
app.use('/', home)
app.use('/api/posts', posts)

// view engine setup
app.set('view engine','pug')
app.set('views', './views') //default, may not be set

// enable morgan in dev mode only
// to disable $export NODE_ENV=production
if(app.get('env')=== 'development') {
  app.use(morgan('tiny')) //tiny output format
  // replace console log
  startUpDebugger('morgan enabled');
}

// db work...
dbDebugger('db handling')

// configuration
console.log('App name: ' + config.get('name'));
console.log('Mail server name: ' + config.get('mail.host'));
// use config/custom-environment-variables to map env to config files
console.log('Mail server password: ' + config.get('mail.password'));


app.use(logger)
app.use(function(req, res, next){
  console.log('Authenticating...');
  next()
})

app.get('*', (req, res) => {
  res
    .status(404)
    .send('not found')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`working on port:${port}`))