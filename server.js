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


app.post('/api/posts', (req, res) => {
  // some validation using joi package
  // define joi schema
  const schema = {
    name: Joi.string().min(3).required()
  }

  /**
   * @returns {Object} error[null], value[req.body.name]
   * if send invalid req - value will be null, error will be set
   */
  const result =  Joi.validate(req.body, schema)

  // if(!req.body.name || req.body.name.length < 3){  //manual validation
  if(result.error){
    res
      .status(400) //bad req
      .send(result.error.details[0].message)
      return //!!!
  }

  const newPost = {
    id: posts.length + 1,
    name: req.body.name
  }
  posts.push(newPost)
  res.send(posts)
})




app.get('*', (req, res) => {
  res
    .status(404)
    .send('not found')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`working on port:${port}`))