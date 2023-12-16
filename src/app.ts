import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import "express-async-errors"

import { userRouter } from "./routes/user"
import { authRouter } from "./routes/auth"
import { boardRouter } from "./routes/board"
import { matchRouter } from "./routes/match"
import { schoolRouter } from "./routes/school"
import { handleErrors } from "./middlewares/errorHandling"

export const app = express();

app.use(bodyParser.json())
app.use(cors({ origin: true, credentials: true }))

app.use(userRouter)
app.use(authRouter)
app.use(boardRouter)
app.use(matchRouter)
app.use(schoolRouter)

app.use(handleErrors)
