
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
import comments from "./routes/comments"
import replies from "./routes/replies"
import postVotes from "./routes/postvotes"
import commentVotes from "./routes/commentVotes"
import replyVotes from "./routes/replyVotes"

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
app.use("/api/comments", comments)
app.use("/api/replies", replies)
app.use("/api/postvotes", postVotes)
app.use("/api/commentvotes", commentVotes)
app.use("/api/replyvotes", replyVotes)

const cron = require('cron')
const https = require('https')
const backendUrl = "http://localhost:5555"
const job = new cron.CronJob("*/14 * * * *", () => {
    console.log("restarting server")
    https.get(backendUrl, (res: any) => {
        if (res.statusCode === 200) {
            console.log('Server restarted')
        }
        else {
            console.log('failed to restart')
        }
    })
})

job.start()

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
