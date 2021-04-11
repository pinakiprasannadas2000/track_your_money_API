const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const incomeRouter = require('./routers/income')
const expenseRouter = require('./routers/expense')
const totalRouter = require('./routers/total')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(incomeRouter)
app.use(expenseRouter)
app.use(totalRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})