
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: users router for CocoDogo
 */

import express from "express"
const users = express.Router()

import { createUser } from "../controller"

users.route('/').post(createUser)
users.route('/:userId').get().post()

export default users 