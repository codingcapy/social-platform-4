
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: replies router for CocoDogo
 */

import express from "express"
const replies = express.Router()

import { createReply, updateReply } from "../controller"

replies.route('/').post(createReply)
replies.route('/:replyId').post(updateReply)

export default replies 