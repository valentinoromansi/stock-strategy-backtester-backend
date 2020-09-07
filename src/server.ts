import { createServer } from "http"
import { app } from "./app"


const port = process.env.port || 4000
const server = createServer(app)
server.listen(port)
