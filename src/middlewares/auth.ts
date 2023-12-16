import jwt from "jsonwebtoken"
import express from "express"

import { JwtUser } from "../models/auth/jwtUser"
import { jwtSecret } from "../env"

declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtUser
        }
    }
}

export function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!jwtSecret) return res.sendStatus(500)

    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, jwtSecret, (err, payload) => {
        if (err) return res.sendStatus(401)
        if (!payload || typeof payload === "string") return res.sendStatus(401)

        const {subject, isAdmin, schoolId} = payload
        req.currentUser = { id: subject, isAdmin: isAdmin, schoolId: schoolId }
        next()
    })
}

export function isAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.currentUser?.isAdmin) return res.sendStatus(401)

    next()
}
