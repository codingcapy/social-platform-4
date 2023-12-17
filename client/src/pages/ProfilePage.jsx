
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: Profile page for CapySocial2
 */

import DOMAIN from "../services/endpoint";
import axios from "axios"
import useAuthStore from "../store/AuthStore";
import { useLoaderData, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import { useState } from "react";
import { getUserIdFromToken } from "../services/jwt.service";

export default function ProfilePage() {

    const { user } = useAuthStore((state) => state);
    const [editMode, setEditMode] = useState(false)
    const [message, setMessage] = useState("");
    const data = useLoaderData();
    const navigate = useNavigate();

    function toggleEditMode() {
        setEditMode(!editMode)
    }

    async function handleEditPassword(e) {
        e.preventDefault()
        const password = e.target.password.value;
        const userId = user.userId
        const updatedUser = { password };
        const res = await axios.post(`${DOMAIN}/api/users/${userId}`, updatedUser);
        toggleEditMode();
        setMessage("Password updated successfully!")
        if (res?.data.success) {
            navigate(`/users/${userId}`);
        }
    }

    return (
        <div>
            <h2 className="py-10 text-2xl text-slate-700 font-medium">Your Profile</h2>
            <p>Username: {data.user.username}</p>
            {editMode
                ? <form onSubmit={handleEditPassword} className="flex flex-col">
                    <input type="password" id="password" name="password" placeholder="New Password" required className="px-2 border rounded-lg border-slate-700 py-1" />
                    <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" >Change password</button>
                    <button className="" onClick={toggleEditMode}>Cancel</button>
                </form>
                :
                <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" onClick={toggleEditMode}>Change password</button>}
            <p>{message}</p>
            <h2 className="py-5 text-2xl text-slate-700 font-medium">Your Posts</h2>
            {data.posts.length === 0 ? <p>You haven't posted anything yet!</p> : data.posts.map((post) => <div key={post.postId} className="py-3">
                <Link to={`/posts/${post.postId.toString()}`} className="">
                    <p>Posted by <strong>{post.username}</strong> on {post.date}</p>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                </Link>
            </div>)}
            <h2 className="py-5 text-2xl text-slate-700 font-medium">Your Comments</h2>
            {data.comments.length === 0 ? <p>You haven't added any comments yet!</p> : data.comments.map((comment) => <div key={comment.commentId} className="my-3">
                <Link to={`/posts/${comment.postId.toString()}`} className="">
                    <p><strong>{comment.username}</strong> {comment.date}</p>
                    <p>{comment.content}</p>
                </Link>
            </div>)}
            <h2 className="py-5 text-2xl text-slate-700 font-medium">Your Replies</h2>
            {data.replies.length === 0 ? <p>You haven't added any replies yet!</p> : data.replies.map((reply) => <div key={reply.replyId} className="my-3">
                <Link to={`/posts/${reply.postId.toString()}`} className="">
                    <p><strong>{reply.username}</strong> {reply.date}</p>
                    <p>{reply.content}</p>
                </Link>
            </div>)}
        </div>
    )
}

export async function userPostsLoader({ params }) {
    const res = await axios.get(`${DOMAIN}/api/users/${params.userId}`)
    return res.data
}