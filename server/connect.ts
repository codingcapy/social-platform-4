
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: mongoDBconnect for CocoDogo
 */

import mongoose from "mongoose"

export default function connectDB(url: any) {
    return mongoose.connect(url)
}

