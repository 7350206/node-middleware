const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res
    .status(200)
    .send('hi')
})


app.get('*', (req, res) => {
  res
    .status(404)
    .send('not found')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`working on port:${port}`))