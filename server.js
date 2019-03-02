const express = require('express')
const app = express()

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


app.get('*', (req, res) => {
  res
    .status(404)
    .send('not found')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`working on port:${port}`))