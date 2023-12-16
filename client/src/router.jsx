
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Layout from "./Layout";
import HomePage, { pageLoader } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostsPage, { postsLoader } from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailsPage, { postDetailsLoader } from "./pages/PostDetailsPage";

export function Router() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} loader={pageLoader} />
                <Route path="/posts" element={<PostsPage />} loader={postsLoader} />
                <Route path="/users/login" element={<LoginPage />} />
                <Route path="/users/signup" element={<SignupPage />} />
                <Route path="/posts/create" element={<CreatePostPage />} />
                <Route path="/posts/:postId" element={<PostDetailsPage />} loader={postDetailsLoader} />
            </Route>
        )
    )
    return router
}