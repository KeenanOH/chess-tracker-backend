import express from "express"

export function handleErrors(err: Error, _: express.Request) {
    console.log(`[ ERROR ] ${err}\n${err.stack}`)
}
