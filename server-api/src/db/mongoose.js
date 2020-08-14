const mongoose = require('mongoose')
const chalk = require('chalk')

mongoose.connect('mongodb://127.0.0.1:27017/social-network-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

console.log(chalk.magenta.bold('[server] ') + 'connection to database established successfully.')