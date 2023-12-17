
/*
author: Paul Kim
date: December 15, 2023
version: 1.0
description: controller for CocoDogo
 */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Reply = require('./models/Reply');
const PostVote = require('./models/PostVote');
const CommentVote = require('./models/CommentVote');
const ReplyVote = require('./models/ReplyVote');

const saltRounds = 6;

export interface IDecodedUser {
    userId: number
};

export async function validateUser(req: Request, res: Response) {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    if (!user) return res.json({ result: { user: null, token: null } });
    bcrypt.compare(password, user?.password || "", function (err, result) {
        if (result === true) {
            const token = jwt.sign({ id: user?.id }, "secret", { expiresIn: "2days" });
            res.json({ result: { user, token } });
        }
        else {
            return res.json({ result: { user: null, token: null } });
        }
    })
}

export async function decryptToken(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(403).send("Header does not exist");
            return "";
        }
        const token = authHeader.split(" ")[1];
        const decodedUser = jwt.verify(token, "secret");
        const user = searchUserById((decodedUser as IDecodedUser).userId);
        res.json({ result: { user, token } });
    }
    catch (err) {
        res.status(401).json({ err });
    }
}

export async function searchUserById(id: number) {
    const user = User.findOne({ userId: id });
    // if (!user) throw new Error("User not found");
    return user;
}

export async function getUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = await User.find({ userId: parseInt(userId) })
    const userPosts = await Post.find({ userId: parseInt(userId) })
    const userComments = await Comment.find({ userId: parseInt(userId) })
    const userReplies = await Reply.find({ userId: parseInt(userId) })
    res.json({ posts: userPosts, comments: userComments, replies: userReplies });
}

export async function createUser(req: Request, res: Response) {
    const users = await User.find({})
    const userId = users.length === 0 ? 1 : users[users.length - 1].userId + 1
    const username = req.body.username;
    const password = req.body.password;
    if (users.find((user: any) => user.username === username.toString())) {
        res.json({ success: false, message: "Username already exists" })
    }
    else {
        console.log(users.find((user: any) => user.username === username.toString()))
        const encrypted = await bcrypt.hash(password, saltRounds)
        const user = await User.create({ username: username, password: encrypted, userId: userId })
        res.status(200).json({ success: true, message: "Sign up successful!" })
    }
}

export async function updateUser(req: Request, res: Response) {
    const userId = await parseInt(req.params.userId)
    const incomingUser = await req.body;
    const incomingPassword = incomingUser.password
    const encrypted = await bcrypt.hash(incomingPassword, saltRounds)
    const updatedUser = await User.findOneAndUpdate(
        { userId: userId },
        { username: incomingUser.username, password: encrypted, userId: incomingUser.userId },
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function createPost(req: Request, res: Response) {
    const posts = await Post.find({})
    const postId = posts.length === 0 ? 1 : posts[posts.length - 1].postId + 1;
    const title = req.body.title
    const content = req.body.content
    const username = req.body.username
    const userId = parseInt(req.body.userId)
    const post = await Post.create({ title, content, username, userId, postId })
    res.status(200).json({ success: true })
}

export async function getPosts(req: Request, res: Response) {
    try {
        const posts = await Post.find({})
        const comments = await Comment.find({})
        const replies = await Reply.find({})
        const postVotes = await PostVote.find({})
        res.json({ posts, comments, replies, postVotes });
    }
    catch (err) {
        res.status(500).json({ msg: err })
    }
}

export async function getPost(req: Request, res: Response) {
    const postId = req.params.postId;
    const post = await Post.findOne({ postId: parseInt(postId) })
    const comments = await Comment.find({ postId: parseInt(postId) })
    const replies = await Reply.find({ postId: parseInt(postId) })
    const postVotes = await PostVote.find({ postId: parseInt(postId) })
    const commentVotes = await CommentVote.find({ postId: parseInt(postId) })
    const replyVotes = await ReplyVote.find({ postId: parseInt(postId) })
    if (!post) {
        res.status(404).json({ error: "Post not found" });
    }
    else {
        res.json({ post, comments, replies, postVotes: postVotes, commentVotes, replyVotes });
    }

}

export async function updatePost(req: Request, res: Response) {
    const postId = parseInt(req.params.postId)
    const incomingPost = req.body;
    const updatedPost = await Post.findOneAndUpdate(
        { postId: postId },
        incomingPost,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function createComment(req: Request, res: Response) {
    const comments = await Comment.find({})
    const commentId = comments.length === 0 ? 1 : comments[comments.length - 1].commentId + 1;
    const incomingComment = req.body
    const comment = await Comment.create({ ...incomingComment, commentId: commentId })
    res.status(200).json({ success: true })
}

export async function updateComment(req: Request, res: Response) {
    const commentId = parseInt(req.params.commentId)
    const incomingComment = req.body;
    const updatedComment = await Comment.findOneAndUpdate(
        { commentId: commentId },
        incomingComment,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function createReply(req: Request, res: Response) {
    const replies = await Reply.find({})
    const replyId = replies.length === 0 ? 1 : replies[replies.length - 1].replyId + 1;
    const incomingNestedComment = req.body
    const nestedComment = await Reply.create({ ...incomingNestedComment, replyId: replyId })
    res.status(200).json({ success: true })
}

export async function updateReply(req: Request, res: Response) {
    const replyId = parseInt(req.params.replyId)
    const incomingReply = req.body;
    const updatedReply = await Reply.findOneAndUpdate(
        { replyId: replyId },
        incomingReply,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function createPostVote(req: Request, res: Response) {
    const postVotes = await PostVote.find({})
    const postVoteId = postVotes.length === 0 ? 1 : postVotes[postVotes.length - 1].postVoteId + 1
    const incomingVote = req.body
    const postVote = await PostVote.create({ ...incomingVote, postVoteId: postVoteId })
    res.status(200).json({ success: true })
}

export async function updatePostVote(req: Request, res: Response) {
    const postVoteId = parseInt(req.params.postVoteId)
    const incomingPostVote = req.body;
    const updatedPostVote = await PostVote.findOneAndUpdate(
        { postVoteId: postVoteId },
        incomingPostVote,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function createCommentVote(req: Request, res: Response) {
    const commentVotes = await CommentVote.find({})
    const commentVoteId = commentVotes.length === 0 ? 1 : commentVotes[commentVotes.length - 1].commentVoteId + 1
    const incomingVote = req.body
    const commentVote = await CommentVote.create({ ...incomingVote, commentVoteId: commentVoteId })
    res.status(200).json({ success: true })
}

export async function updateCommentVote(req: Request, res: Response) {
    const commentVoteId = parseInt(req.params.commentVoteId)
    const incomingCommentVote = req.body;
    const updatedCommentVote = await CommentVote.findOneAndUpdate(
        { commentVoteId: commentVoteId },
        incomingCommentVote,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function createReplyVote(req: Request, res: Response) {
    const replyVotes = await ReplyVote.find({})
    const replyVoteId = replyVotes.length === 0 ? 1 : replyVotes[replyVotes.length - 1].replyVoteId + 1
    const incomingVote = req.body
    const replyVote = await ReplyVote.create({ ...incomingVote, replyVoteId: replyVoteId })
    res.status(200).json({ success: true })
}

export async function updateReplyVote(req: Request, res: Response) {
    const replyVoteId = parseInt(req.params.replyVoteId)
    const incomingReplyVote = req.body;
    const updatedReplyVote = await ReplyVote.findOneAndUpdate(
        { replyVoteId: replyVoteId },
        incomingReplyVote,
        { new: true }
    );
    res.status(200).json({ success: true });
}