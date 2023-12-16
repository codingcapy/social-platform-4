
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: Comment component for CapySocial2
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
    const userId = getUserIdFromToken()
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
        const username = user?.username;
        const newComment = { content, postId, commentId, username };
        const res = await axios.post(`${DOMAIN}/api/replies`, newComment);
        toggleReplyMode()
        if (res?.data.success) {
            e.target.content.value = "";
            navigate(`/posts/${props.postId}`);
        }
    }

    async function clickUpvote() {
        if (!props.commentVotes.find((commentVote) => commentVote.voterId === userId)) {
            const value = 1
            const voterId = userId;
            const commentId = props.id
            const postId = props.postId;
            const vote = { value, postId, commentId, voterId, };
            const res = await axios.post(`${DOMAIN}/api/commentvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
        else if (props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].value === 0 || props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].value === -1) {
            const value = 1
            const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].id;
            const updatedVote = { value }
            const res = await axios.post(`${DOMAIN}/api/commentvotes/${commentVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
    }

    async function neutralVote() {
        const value = 0
        const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].id;
        const updatedVote = { value }
        const res = await axios.post(`${DOMAIN}/api/commentvotes/${commentVoteId}`, updatedVote)
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`);
        }
    }

    async function clickDownVote() {
        if (!props.commentVotes.find((commentVote) => commentVote.voterId === userId)) {
            const value = -1
            const voterId = userId;
            const commentId = props.id
            const postId = props.postId;
            const vote = { value, postId, commentId, voterId, };
            const res = await axios.post(`${DOMAIN}/api/commentvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
        else if (props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].value === 0 || props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].value === 1) {
            const value = -1
            const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].id;
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
        </div>
    )
}