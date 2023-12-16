import express from "express"

export function logRequests(req: express.Request, _: express.Response, next: express.NextFunction) {
    console.log(`[ ${req.method} ] ${req.path}`)

    next()
}
