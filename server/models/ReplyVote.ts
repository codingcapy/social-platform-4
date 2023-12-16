
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: reply vote schema for CocoDogo
 */

import mongoose from "mongoose";

const ReplyVoteSchema = new mongoose.Schema({
    value: { type: Number, required: [true, 'value is required'] },
    postId: { type: Number, required: [true, 'postId is required'] },
    commentId: { type: Number, required: [true, 'commentId is required'] },
    replyId: { type: Number, required: [true, 'replyId is required'] },
    voterId: { type: Number, required: [true, 'voterId is required'] },
    replyVoteId: { type: Number, required: [true, 'replyVoteId is required'] },
})

module.exports = mongoose.model('ReplyVote', ReplyVoteSchema)