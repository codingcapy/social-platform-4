
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: Create post page for CapySocial2
 */

import { useNavigate } from "react-router-dom"
import DOMAIN from "../services/endpoint";
import axios from "axios"
import { getUserIdFromToken } from "../services/jwt.service"
import React, { useState } from 'react';
import useAuthStore from "../store/AuthStore";


export default function CreatePostPage() {

    const navigate = useNavigate();
    const { user } = useAuthStore((state) => state)
    const currentUserId = parseInt(user.userId)

    async function handleSubmit(e) {
        e.preventDefault()
        const title = e.target.title.value;
        const content = e.target.content.value
        const username = user.username
        const userId = currentUserId;
        const newPost = { title, content, username, userId }
        const res = await axios.post(`${DOMAIN}/api/posts`, newPost)
        if (res?.data.success) {
            navigate("/")
        }
    }

    return (
        <div>
            <h2 className="py-10 text-2xl text-slate-700 font-medium text-center">Create Post</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex flex-col">
                    <label htmlFor="title" >Title</label>
                    <input type="text" name='title' id='title' placeholder="Title" required className="px-2 border rounded-lg border-slate-700 py-1" />
                </div>
                <div className="flex flex-col my-2">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name='content' id='content' placeholder='Content' required rows="10" cols="40" className="px-2 border rounded-lg border-slate-700 py-1" />
                </div>
                <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Create</button>
            </form>
        </div>
    )

}
