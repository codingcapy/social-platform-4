
/*
author: Paul Kim
date: December 16, 2023
version: 1.0
description: comments router for CocoDogo
 */

import express from "express"
const comments = express.Router()

import { createComment, updateComment } from "../controller"

comments.route('/').post(createComment)
comments.route('/:commentId').post(updateComment)

export default comments 