import express from 'express'

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  return res.json({
    message: 'Hello World'
  })
})

app.listen(port, () => console.log(`Server is running at ${port}`))
