import express from "express"

export function handleErrors(err: Error, _: express.Request, res: express.Response) {
    console.log(`[ ERROR ] ${err}\n${err.stack}`)
    res.sendStatus(500)
}
