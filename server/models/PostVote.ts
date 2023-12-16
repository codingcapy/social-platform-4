
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: postvote schema for CocoDogo
 */

import mongoose from "mongoose";

const PostVoteSchema = new mongoose.Schema({
    value: { type: Number, required: [true, 'value is required'] },
    postId: { type: Number, required: [true, 'postId is required'] },
    voterId: { type: Number, required: [true, 'voterId is required'] },
    postVoteId: { type: Number, required: [true, 'postVoteId is required'] },
})

module.exports = mongoose.model('PostVote', PostVoteSchema)