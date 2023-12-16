import mongoose from "mongoose"

import { app } from "./app"
import { databaseUrl } from "./env"

const port = 3000

app.listen(port, async () => {
    if (databaseUrl) await mongoose.connect(databaseUrl)
    console.log(`Listening on port ${port}`)
})
