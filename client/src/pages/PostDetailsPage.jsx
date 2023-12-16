
/*
author: Paul Kim
date: December 16, 2023
version: 1.0
description: Post detailss page for CocoDogo
 */

import axios from "axios"
import DOMAIN from "../services/endpoint";
import { useLoaderData, useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { getUserIdFromToken } from "../services/jwt.service";
import { useState } from "react";
import { TbArrowBigUp, TbArrowBigDown, TbArrowBigUpFilled, TbArrowBigDownFilled } from 'react-icons/tb'
import Comment from "../components/Comment";

export default function PostDetailsPage() {

    const data = useLoaderData();
    const { user } = useAuthStore((state) => state);
    const currentUserId = parseInt(user?.userId) || null
    const [editMode, setEditMode] = useState(false)
    const [editedTitle, setEditedTitle] = useState(data.post.title);
    const [editedContent, setEditedContent] = useState(data.post.content);
    const navigate = useNavigate();

    function toggleEditMode() {
        setEditMode(!editMode)
    }

    async function handleEditPost(e) {
        e.preventDefault()
        const title = e.target.title.value;
        const content = e.target.content.value;
        const edited = true;
        const deleted = false;
        const updatedPost = { title, content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/posts/${data.post.postId}`, updatedPost);
        toggleEditMode();
        if (res?.data.success) {
            e.target.title.value = "";
            e.target.content.value = "";
            navigate(`/posts/${data.post.postId}`);
        }
    }

    async function handleDeletePost() {
        const title = data.post.title;
        const content = "[This post was deleted]";
        const edited = false;
        const deleted = true;
        const updatedPost = { title, content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/posts/${data.post.postId}`, updatedPost);
        if (res?.data.success) {
            navigate(`/posts/${data.post.postId}`);
        }
    }

    async function handleCommentSubmit(e) {
        e.preventDefault()
        const content = e.target.content.value;
        const postId = data.post.postId;
        const userId = currentUserId
        const username = user.username;
        const newComment = { content, postId, userId, username };
        const res = await axios.post(`${DOMAIN}/api/comments`, newComment);
        if (res?.data.success) {
            e.target.content.value = "";
            navigate(`/posts/${data.post.postId}`);
        }
    }

    async function clickUpvote() {
        if (!data.postVotes.find((postVote) => postVote.voterId === currentUserId)) {
            const value = 1
            const voterId = currentUserId;
            const postId = data.post.postId;
            const vote = { value, postId, voterId };
            const res = await axios.post(`${DOMAIN}/api/postvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${data.post.postId}`);
            }
        }
        else if (data.postVotes.filter((postVote) => postVote.voterId === currentUserId)[0].value === 0 || data.postVotes.filter((postVote) => postVote.voterId === parseInt(userId))[0].value === -1) {
            const value = 1
            const postVoteId = data.postVotes.filter((postVote) => postVote.voterId === currentUserId)[0].postVoteId;
            const updatedVote = { value }
            const res = await axios.post(`${DOMAIN}/api/postvotes/${postVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${data.post.postId}`);
            }
        }
    }

    async function neutralVote() {
        const value = 0
        const postVoteId = data.postVotes.filter((postVote) => postVote.voterId === currentUserId)[0].postVoteId;
        const updatedVote = { value }
        const res = await axios.post(`${DOMAIN}/api/postvotes/${postVoteId}`, updatedVote)
        if (res?.data.success) {
            navigate(`/posts/${data.post.postId}`);
        }
    }

    async function clickDownVote() {
        if (!data.postVotes.find((postVote) => postVote.voterId === currentUserId)) {
            const value = -1
            const voterId = currentUserId;
            const postId = data.post.postId;
            const vote = { value, postId, voterId };
            const res = await axios.post(`${DOMAIN}/api/postvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${data.post.postId}`);
            }
        }
        else if (data.postVotes.filter((postVote) => postVote.voterId === currentUserId)[0].value === 0 || data.postVotes.filter((postVote) => postVote.voterId === parseInt(currentUserId))[0].value === 1) {
            const value = -1
            const postVoteId = data.postVotes.filter((postVote) => postVote.voterId === currentUserId)[0].postVoteId;
            const updatedVote = { value }
            const res = await axios.post(`${DOMAIN}/api/postvotes/${postVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${data.post.postId}`);
            }
        }
    }

    return (
        <div className="py-10 px-10 shadow-xl">
            {editMode
                ? <div>
                    <form onSubmit={handleEditPost} className="flex flex-col">
                        <h2>Edit Post</h2>
                        <div className="flex flex-col">
                            <label htmlFor="title">Title</label>
                            <input type="text" name='title' id='title' placeholder="Title" value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)} required className="px-2 border rounded-lg border-slate-700 py-1" />
                        </div>
                        <div className="flex flex-col my-2">
                            <label htmlFor="content">Content</label>
                            <textarea type="text" name='content' id='content' placeholder='Content' value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)} required rows="10" cols="50" className="px-2 border rounded-lg border-slate-700 py-1" />
                        </div>
                        <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Update</button>
                        <button onClick={toggleEditMode} className="">Cancel</button>
                    </form>
                </div>
                : <div>
                    <p>Posted by <strong>{data.post.username}</strong> on {data.post.date} {data.post.edited && "(edited)"}</p>
                    <h2 className="py-5 text-2xl text-slate-700 font-medium text-center">{data.post.title}</h2>
                    {user?.username !== data.post.username
                        ? data.postVotes.find((postVote) => postVote.voterId === currentUserId) !== undefined && data.postVotes.find((postVote) => postVote.voterId === currentUserId).value > 0
                            ? user && <div onClick={neutralVote} className=""><TbArrowBigUpFilled size={25} /></div>
                            : user && <div onClick={clickUpvote} className=""><TbArrowBigUp size={25} /></div>
                        : <TbArrowBigUp size={25} />}
                    {!user && <Link to={"/users/login"}><TbArrowBigUp size={25} /></Link>}
                    <p className="px-2"> {data.postVotes.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
                    {user?.username !== data.post.username
                        ? data.postVotes.find((postVote) => postVote.voterId === currentUserId) !== undefined && data.postVotes.find((postVote) => postVote.voterId === currentUserId).value < 0
                            ? user && <div onClick={neutralVote} className=""><TbArrowBigDownFilled size={25} /></div>
                            : user && <div onClick={clickDownVote} className=""><TbArrowBigDown size={25} /></div>
                        : <TbArrowBigDown size={25} />}
                    {!user && <Link to={"/users/login"}><TbArrowBigDown size={25} /></Link>}
                    <p className="py-3">{data.post.content}</p>
                    {data.post.deleted ? "" : user?.username === data.post.username && <button onClick={toggleEditMode} className="px-3 py-3 font-bold">Edit</button>}
                    {data.post.deleted ? "" : user?.username === data.post.username && <button onClick={handleDeletePost} className="px-3 font-bold">Delete</button>}
                    <h3 className="py-5 text-2xl text-slate-700 font-medium">Comments</h3>
                    {!user && <p>Please log in to add comments!</p>}
                    {user && <form onSubmit={handleCommentSubmit}>
                        <label htmlFor="content">Add comment</label>
                        <div className="flex flex-col">
                            <textarea type="text" name="content" id="content" placeholder="What are your thoughts?" required rows="5" cols="15" className="px-2 border rounded-lg border-slate-700 py-1" />
                            <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Comment</button>
                        </div>
                    </form>}
                    <hr />
                    {data.comments.map((comment) =>
                        <Comment key={comment.commentId} id={comment.commentId} username={comment.username} content={comment.content} date={comment.date} edited={comment.edited} deleted={comment.deleted} postId={comment.postId} commentVotes={data.commentVotes.filter((commentVote) => commentVote.commentId === comment.commentId)} replies={data.replies.filter((reply) => reply.commentId === comment.commentId)} replyVotes={data.replyVotes.filter((replyVote) => replyVote.commentId === comment.commentId)} />)}
                </div>
            }
        </div>
    )
}

export async function postDetailsLoader({ params }) {
    const res = await axios.get(`${DOMAIN}/api/posts/${params.postId}`)
    return res.data
}