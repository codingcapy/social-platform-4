
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
const Reply = require('./models/Comment');
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