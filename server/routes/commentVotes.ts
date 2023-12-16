
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: comment votes router for CocoDogo
 */

import express from "express"
const commentVotes = express.Router()

import { createCommentVote, updateCommentVote } from "../controller"

commentVotes.route('/').post(createCommentVote)
commentVotes.route('/:commentVoteId').post(updateCommentVote)

export default commentVotes 