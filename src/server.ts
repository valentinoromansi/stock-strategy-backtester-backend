import { createServer } from "http"
import { app } from "./app"
import colors from "colors"
import 'dotenv/config'

const envFileValidityCheck = () => {
	const envVarErrorMsgMap: { [id: string]: string; } = {
		PORT: 'PORT value is missing from .env file!',
		ACCESS_TOKEN_PRIVATE_KEY: 'ACCESS_TOKEN_PRIVATE_KEY value is missing from .env file!',
		ACCESS_USERS: 'ACCESS_USERS value is missing from .env file!'
	}
	let valid = true
	for (let key in envVarErrorMsgMap) {
		if(!process.env[key]) {
			console.log(colors.red(envVarErrorMsgMap[key]))
			valid = false
		}
	}
	if(!valid) {
		console.log(colors.red('Application failed to start!'))
		process.exit()
	}
	return valid
}

// Server start here
console.log(colors.green('Server starting...'))
envFileValidityCheck()
const port = process.env.port || 3000
const server = createServer(app)
server.listen(port)
console.log(colors.green(`Server started on port ${port}`))