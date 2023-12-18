
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Layout from "./Layout";
import HomePage, { pageLoader } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostsPage, { postsLoader } from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailsPage, { postDetailsLoader } from "./pages/PostDetailsPage";
import ProfilePage, { userPostsLoader } from "./pages/ProfilePage";
import MaintenancePage from "./pages/MaintenancePage";

export function Router() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<Layout />}>
                <Route path="/maintenance" element={<HomePage />} loader={pageLoader} />
                <Route path="/maintenance2" element={<PostsPage />} loader={postsLoader} />
                <Route path="/users/maintenance3" element={<LoginPage />} />
                <Route path="/users/maintenance4" element={<SignupPage />} />
                <Route path="/posts/create" element={<CreatePostPage />} />
                <Route path="/posts/:postId" element={<PostDetailsPage />} loader={postDetailsLoader} />
                <Route path="/users/:userId" element={<ProfilePage />} loader={userPostsLoader} />
                <Route path="/" element={<MaintenancePage />} />
                <Route path="/posts" element={<MaintenancePage />} />
                <Route path="/users/login" element={<MaintenancePage />} />
                <Route path="/users/signup" element={<MaintenancePage />} />
            </Route>
        )
    )
    return router
}