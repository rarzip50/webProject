const express = require('express')
require('./db/mongoose')// run db
const chalk = require('chalk')
const User = require('./models/user')
const Post = require('./models/post')
const userRouter = require('./routers/user')
const postsRouter = require('./routers/post')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())// automaticly parse incoming JSON to objects
app.use(userRouter)
app.use(postsRouter)

//
// without middleware:  new request -> run route handler
//
// with middleware:     new request -> do something -> run route handler
//

app.listen(port, () => {
    console.log(chalk.magenta.bold('[server]') + ' up on port ' + port + '.')
})