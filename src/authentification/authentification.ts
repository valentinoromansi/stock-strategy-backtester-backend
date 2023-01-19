const fs = require("fs")
//const jwt = require("jsonwebtoken")
import jwt from 'jsonwebtoken'
import 'dotenv/config'


export interface AuthentificationCredentials {
	user: string,
	password: string
}

export function authenticateUserCredentials(requestCredentials: AuthentificationCredentials): boolean {
	const allowedCredentials: AuthentificationCredentials[] = JSON.parse(process.env.ACCESS_USERS)
	return allowedCredentials.some(allowedCredential => {
		return allowedCredential.user === requestCredentials.user && allowedCredential.password === requestCredentials.password
	})
}

export function generateAccessToken(credentials: AuthentificationCredentials) {
	return jwt.sign({user: credentials.user}, process.env.ACCESS_TOKEN_PRIVATE_KEY)
}

// Header.authorization must be in format "Bearer token"
export function authenticateAccessToken(req: any, res: any, next: any) {
	const auth = req?.headers?.authorization
	if(!auth || auth.split(' ').length < 2) 
		return res.status(401).send({message: 'Access token verification failed! Access token could not be extracted from header!'})
	const token = auth.split(' ')[1]
	jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err: any, obj: any) => {
		if(err)
			return res.status(403).send({message: 'Access token verification failed! Access token extracted but verification failed!'})
		res.accessToken=token
		next()
	})
}