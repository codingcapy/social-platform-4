
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: post schema for CocoDogo
 */

import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'title is required'], trim: true, maxlength: [300, 'title char limit is 300'] },
    content: { type: String, required: [true, 'content is required'], trim: true, maxlength: [40000, 'content char limit is 40000'] },
    date: { type: Date, required: true, default: Date.now },
    edited: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    username: { type: String, required: true },
    userId: { type: Number, required: true },
    postId: { type: Number, required: true }
})

module.exports = mongoose.model('Post', PostSchema)