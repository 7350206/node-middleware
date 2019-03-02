const Joi = require('joi') // input validator
const express = require('express')
const app = express()

app.use(express.json())

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
  // !! req.params.id returns a String
  const post =  posts.find(p => p.id === parseInt(req.params.id))
  if(!post){
    res
      .status(404)
      .send(`post ${req.params.id} not found`)
  }
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
  if(!post){
    res.status(404).send('post not found')
    return
  }

  // 2) validate, if no - return 400 and exit
  // reuse external validation
  // const result = validatePost(req.body)
  // ------- use object destruct (validatePost returns {error, value})
  const {error} = validatePost(req.body) //result.error
  if(error){
    res
      .status(400)
      .send(error.details[0].message)
      return
  }

  // 3) update and show updated on client
  post.name = req.body.name
  res.send(posts)

} )

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