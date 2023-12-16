
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: web server app for CocoDogo
 */

import express from "express"
import cors from "cors"
import connectDB from "./connect"
import dotenv from "dotenv"
import user from "./routes/user"
import users from "./routes/users"
import posts from "./routes/posts"

dotenv.config()
const app = express()
const port = process.env.PORT || 5555

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("welcome")
})

app.use("/api/users", users)
app.use("/api/user", user)
app.use("/api/posts", posts)

async function start() {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server listening on port: ${port}`));
    }
    catch (err) {
        console.log(err)
    }
}

start()
