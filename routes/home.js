const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res
    .status(200)
    // .send('hi there')
    .render('index', { title: "Site app", message: "Hi there" })
})


module.exports = router