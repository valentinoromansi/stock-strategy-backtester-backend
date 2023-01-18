const fs = require("fs")

export interface AuthentificationCredentials {
	user: string,
	password: string
}

export function authenticate(requestCredentials: AuthentificationCredentials) {
	const allowedCredentials: AuthentificationCredentials[] = JSON.parse(process.env.ACCESS_USERS)
	return allowedCredentials.some(allowedCredential => {
		return allowedCredential.user === requestCredentials.user && allowedCredential.password === requestCredentials.password
	})
}