const helmet = require('helmet')
const Joi = require('joi') // input validator
const express = require('express')
const logger = require('./logger')
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

// enable morgan in dev mode only
// to disable $export NODE_ENV=production
if(app.get('env')=== 'development') {
  app.use(morgan('tiny')) //tiny output format
  console.log('morgan enabled');
}

app.use(logger)
app.use(function(req, res, next){
  console.log('Authenticating...');
  next()
})


const posts = [
  {id:1, name: 'post1'},
  {id:2, name: 'post2'},
  {id:3, name: 'post3'},
]

app.get('/', (req, res) => {
  res
    .status(200)
    .send('hi')
})

app.get('/api/posts', (req, res) => {
  res.send(posts)
})

app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.params) //{"year":"2023","month":"2"}
})

app.get('/api/posts/:id', (req, res) => {
  // !! req.params.id returns a String, so make it a Int
  const post =  posts.find(p => p.id === parseInt(req.params.id))
  if(!post) return res.status(404).send(`post ${req.params.id} not found`)
  // if exist
  res.send(post)
})

/* ADD NEW POST */
app.post('/api/posts', (req, res) => {
  // 1) some validation using joi package (in external function)

  /**
   * @returns {Object} error[null], value[req.body.name]
   * if send invalid req - value will be null, error will be set
   */
  const {error} = validatePost(req.body)

  // if(!req.body.name || req.body.name.length < 3){  //manual validation
  if(error){
    res
      .status(400) //bad req
      .send(error.details[0].message)
      return //!!!
  }

  const newPost = {
    id: posts.length + 1,
    name: req.body.name
  }
  posts.push(newPost)
  res.send(posts)
})

/* UPDATE POST */
app.put('/api/posts/:id', (req, res) => {
  // 1)check if post exists, if no - return 404 and exit
  const post = posts.find(p => p.id === parseInt(req.params.id))
  /* if(!post){
    res.status(404).send('post not found')
    return
  } */
  if (!post) return res.status(404).send('Post for update was not found')

  // 2) validate, if no - return 400 and exit
  // reuse external validation
  // const result = validatePost(req.body)
  // ------- use object destruct (validatePost returns {error, value})
  const {error} = validatePost(req.body) //result.error
  if(error) return res.status(400).send(error.details[0].message)

  // 3) update and show updated on client
  post.name = req.body.name
  res.send(posts)
} )


// DELETE REQ
app.delete('/api/posts/:id', (req, res) => {
  // look up post, if !exists - return 404 and exit
  const post = posts.find(p => p.id === parseInt(req.params.id))
  if (!post) return res.status(404).send('post for deleting not found')

  // delete
  const index = posts.indexOf(post)
  posts.splice(index, 1)  //onplace, maybe slice is better

  // show others on client
  res.send(posts)
})


/**
 * try external validation
 * @param {String} req.body post name
 * @returns {Object} error[null], value[req.body.name]
 * if send invalid req - value will be null, error will be set
 */
function validatePost(post){
  console.log('req.body:', post);
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(post, schema)
}





app.get('*', (req, res) => {
  res
    .status(404)
    .send('not found')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`working on port:${port}`))