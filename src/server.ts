import { createServer } from "http"
import { app } from "./app"

console.log('Server starting...')
const port = process.env.port || 4000
const server = createServer(app)
server.listen(port)
console.log('Server started...')