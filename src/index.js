const http = require('http')
const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const AuthRouter = require('./router/AuthRouter')
const ChatRouter = require('./router/ChatRouter')
const FriendRouter = require('./router/FriendRouter')
const RequestRouter = require('./router/RequestRouter')

const app = express()
app.use(cors())

const server = http.createServer(app)
const port = process.env.PORT || 3000

app.use(AuthRouter)
app.use(ChatRouter)
app.use(FriendRouter)
app.use(RequestRouter)

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})