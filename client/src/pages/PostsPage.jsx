
import { Link, useLoaderData } from "react-router-dom"
import axios from "axios"
import DOMAIN from "../services/endpoint"
import useSearchStore from '../store/SearchStore';
import { useState, useEffect } from "react"

export default function PostsPage() {

    const data = useLoaderData()
    const { content } = useSearchStore((state) => state)
    const [sortState, setSortState] = useState(
        data.posts.map((post) =>
            <div key={post.postId} className="border border-slate-700 rounded-xl px-3 py-3">
                <Link to={`/posts/${post.postId}`} className="flex flex-col text-center">
                    <p className="py-2">Posted by <strong>{post.username}</strong> on {post.date.toLocaleString()}</p>
                    <p >upvotes: {data.postVotes.filter((postVote) => postVote.postId === post.postId).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
                    <h3 className="py-3 text-2xl text-slate-700 font-medium">{post.title}</h3>
                    <p>{post.content}</p>
                    <p className="py-3">{data.comments.filter((comment) => comment.postId === post.postId).length + data.replies.filter((reply) => reply.postId === post.psotId).length} {data.comments.filter((comment) => comment.postId === post.postId).length + data.replies.filter((reply) => reply.postId === post.postId).length == 1 ? "comment" : "comments"}</p>
                </Link>
            </div>)
    )

    useEffect(() => {
        setSortState(
            data.posts.map((post) =>
                content !== ""
                    ? post.title.toLowerCase().includes(content.toLowerCase()) || post.content.toLowerCase().includes(content.toLowerCase())
                        ? <div key={post.postId} className="border border-slate-700 rounded-xl px-3 py-3"><Link to={`/posts/${post.postId}`} className="flex flex-col text-center">
                            <p className="py-2">Posted by <strong>{post.username}</strong> on {post.date.toLocaleString()}</p>
                            <p >upvotes: {data.postVotes.filter((postVote) => postVote.postId === post.postId).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
                            <h3 className="py-3 text-2xl text-slate-700 font-medium">{post.title}</h3>
                            <p>{post.content}</p>
                            <p className="py-3">{data.comments.filter((comment) => comment.postId === post.postId).length + data.replies.filter((reply) => reply.postId === post.postId).length} {data.comments.filter((comment) => comment.postId === post.postId).length + data.replies.filter((reply) => reply.postId === post.postId).length == 1 ? "comment" : "comments"}</p>
                        </Link>
                        </div>
                        : ""
                    : <div key={post.postId} className="border border-slate-700 rounded-xl px-3 py-3">
                        <Link to={`/posts/${post.postId}`} className="flex flex-col text-center">
                            <p className="py-2">Posted by <strong>{post.username}</strong> on {post.date.toLocaleString()}</p>
                            <p >upvotes: {data.postVotes.filter((postVote) => postVote.postId === post.postId).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
                            <h3 className="py-3 text-2xl text-slate-700 font-medium">{post.title}</h3>
                            <p>{post.content}</p>
                            <p className="py-3">{data.comments.filter((comment) => comment.postId === post.postId).length + data.replies.filter((reply) => reply.postId === post.postId).length} {data.comments.filter((comment) => comment.postId === post.postId).length + data.replies.filter((reply) => reply.postId === post.postId).length == 1 ? "comment" : "comments"}</p>
                        </Link>
                    </div>)
        )
    }, [content])

    return (
        <div>
            <h1 className="py-5 text-2xl text-slate-700 font-medium text-center">Posts</h1>
            <div className="md:grid md:gap-4 md:grid-cols-3">
                {sortState}
            </div>
        </div>
    )


}

export async function postsLoader() {
    const res = await axios.get(`${DOMAIN}/api/posts`)
    return res.data
}