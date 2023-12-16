
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: replyVotes router for CocoDogo
 */

import express from "express"
const replyVotes = express.Router()

import { createReplyVote, updateReplyVote } from "../controller"

replyVotes.route('/').post(createReplyVote)
replyVotes.route('/:replyVoteId').post(updateReplyVote)

export default replyVotes 