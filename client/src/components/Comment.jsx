
/*
author: Paul Kim
date: December 16, 2023
version: 1.0
description: Comment component for CocoDogo
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../services/jwt.service";
import useAuthStore from "../store/AuthStore";
import axios from "axios"
import DOMAIN from "../services/endpoint";
import { TbArrowBigUp, TbArrowBigDown, TbArrowBigUpFilled, TbArrowBigDownFilled } from 'react-icons/tb'
import Reply from "./Reply";

export default function Comment(props) {

    const [commentEditMode, setCommentEditMode] = useState(false)
    const { user } = useAuthStore((state) => state);
    const [editedContent, setEditedContent] = useState(props.content);
    const navigate = useNavigate();
    const currentUserId = parseInt(user?.userId) || null
    const [replyMode, setReplyMode] = useState(false)

    function toggleCommentEditMode() {
        setCommentEditMode(!commentEditMode)
    }

    function toggleReplyMode() {
        setReplyMode(!replyMode)
    }

    async function handleEditComment(e) {
        e.preventDefault()
        const content = e.target.content.value;
        const edited = true;
        const deleted = false;
        const updatedComment = { content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/comments/${props.id}`, updatedComment)
        toggleCommentEditMode()
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`)
        }
    }

    async function handleDeleteComment() {
        const content = "[This comment was deleted]"
        const edited = false;
        const deleted = true;
        const updatedComment = { content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/comments/${props.id}`, updatedComment)
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`)
        }
    }

    async function handleReplySubmit(e) {
        e.preventDefault()
        const content = e.target.content.value;
        const postId = props.postId;
        const commentId = props.id;
        const userId = currentUserId;
        const username = user?.username;
        const newComment = { content, postId, commentId, userId, username };
        const res = await axios.post(`${DOMAIN}/api/replies`, newComment);
        toggleReplyMode()
        if (res?.data.success) {
            e.target.content.value = "";
            navigate(`/posts/${props.postId}`);
        }
    }

    async function clickUpvote() {
        if (!props.commentVotes.find((commentVote) => commentVote.voterId === currentUserId)) {
            const value = 1
            const voterId = currentUserId;
            const commentId = props.id
            const postId = props.postId;
            const vote = { value, postId, commentId, voterId, };
            const res = await axios.post(`${DOMAIN}/api/commentvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
        else if (props.commentVotes.filter((commentVote) => commentVote.voterId === currentUserId)[0].value === 0 || props.commentVotes.filter((commentVote) => commentVote.voterId === currentUserId)[0].value === -1) {
            const value = 1
            const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === currentUserId)[0].commentVoteId;
            const updatedVote = { value }
            const res = await axios.post(`${DOMAIN}/api/commentvotes/${commentVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
    }

    async function neutralVote() {
        const value = 0
        const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === currentUserId)[0].commentVoteId;
        const updatedVote = { value }
        const res = await axios.post(`${DOMAIN}/api/commentvotes/${commentVoteId}`, updatedVote)
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`);
        }
    }

    async function clickDownVote() {
        if (!props.commentVotes.find((commentVote) => commentVote.voterId === currentUserId)) {
            const value = -1
            const voterId = currentUserId;
            const commentId = props.id
            const postId = props.postId;
            const vote = { value, postId, commentId, voterId, };
            const res = await axios.post(`${DOMAIN}/api/commentvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
        else if (props.commentVotes.filter((commentVote) => commentVote.voterId === currentUserId)[0].value === 0 || props.commentVotes.filter((commentVote) => commentVote.voterId === currentUserId)[0].value === 1) {
            const value = -1
            const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === currentUserId)[0].commentVoteId;
            const updatedVote = { value }
            const res = await axios.post(`${DOMAIN}/api/commentvotes/${commentVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
    }

    return (
        <div className="my-3">
            <p className="py-2"><strong>{props.username}</strong> {props.date} {props.edited && '(edited)'}</p>
            {commentEditMode
                ? <form onSubmit={handleEditComment}>
                    <input type="text" name="content" id="content" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="px-2 py-1 border rounded-lg border-slate-700" required />
                    <p><button type="submit" className="font-bold">Update</button>
                        <button onClick={toggleCommentEditMode} className="px-3 font-bold">Cancel</button></p>
                </form>
                : <div>
                    <p className="py-2">{props.content} {props.deleted ? "" : props.username === user?.username && <button onClick={toggleCommentEditMode} className="font-bold">Edit</button>}
                        {props.deleted ? "" : props.username === user?.username && <button onClick={handleDeleteComment} className="px-3 font-bold">Delete</button>}</p>

                </div>
            }
            <p className="">Upvotes: {props.commentVotes.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}
                {user?.username !== props.username
                    ? props.commentVotes.find((commentVote) => commentVote.voterId === currentUserId) !== undefined && props.commentVotes.find((commentVote) => commentVote.voterId === currentUserId).value > 0
                        ? currentUserId && <button onClick={neutralVote} className="px-1"><TbArrowBigUpFilled size={20} /></button>
                        : currentUserId && <button onClick={clickUpvote} className="px-1"><TbArrowBigUp size={20} /></button>
                    : ""}
                {user?.username !== props.username
                    ? props.commentVotes.find((commentVote) => commentVote.voterId === currentUserId) !== undefined && props.commentVotes.find((commentVote) => commentVote.voterId === currentUserId).value < 0
                        ? currentUserId && <button onClick={neutralVote} className="px-1"><TbArrowBigDownFilled size={20} /></button>
                        : currentUserId && <button onClick={clickDownVote} className="px-1"><TbArrowBigDown size={20} /></button>
                    : ""}
                {currentUserId && <button onClick={toggleReplyMode} className="px-3 font-bold">Reply</button>}
            </p>
            {replyMode && <div>
                <form onSubmit={handleReplySubmit}>
                    <input type="text" name="content" id="content" className="px-2 py-1 border rounded-lg border-slate-700" required />
                    <p><button type="submit" className="px-3 font-bold">Reply</button>
                        <button className="px-3 font-bold" onClick={toggleReplyMode}>Cancel</button></p>
                </form>
            </div>}
            <div>
                {props.replies.map((reply) => <Reply key={reply.replyId} id={reply.replyId} content={reply.content} date={reply.date} edited={reply.edited} deleted={reply.deleted} postId={reply.postId} commentId={reply.commentId} username={reply.username} replyVotes={props.replyVotes.filter((replyVote) => replyVote.replyId === reply.replyId)} />)}
            </div>
        </div>
    )
}