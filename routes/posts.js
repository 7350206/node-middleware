// need to use Router to work from separate file
const express = require('express')
const Joi = require('joi') // input validator

const router = express.Router()


const posts = [
  { id: 1, name: 'post1' },
  { id: 2, name: 'post2' },
  { id: 3, name: 'post3' },
]


// router.get('/api/posts', (req, res) => {
// make routes shorter, 'api/posts' already defined in routes mware
router.get('/', (req, res) => {
  res.send(posts)
})

router.get('/:year/:month', (req, res) => {
  res.send(req.params) //{"year":"2023","month":"2"}
})

router.get('/:id', (req, res) => {
  // !! req.params.id returns a String, so make it a Int
  const post = posts.find(p => p.id === parseInt(req.params.id))
  if (!post) return res.status(404).send(`post ${req.params.id} not found`)
  // if exist
  res.send(post)
})

/* ADD NEW POST */
router.post('/', (req, res) => {
  // 1) some validation using joi package (in external function)

  /**
   * @returns {Object} error[null], value[req.body.name]
   * if send invalid req - value will be null, error will be set
   */
  const { error } = validatePost(req.body)

  // if(!req.body.name || req.body.name.length < 3){  //manual validation
  if (error) {
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
router.put('/:id', (req, res) => {
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
  const { error } = validatePost(req.body) //result.error
  if (error) return res.status(400).send(error.details[0].message)

  // 3) update and show updated on client
  post.name = req.body.name
  res.send(posts)
})


// DELETE REQ
router.delete('/:id', (req, res) => {
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
function validatePost(post) {
  console.log('req.body:', post);
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(post, schema)
}


module.exports = router