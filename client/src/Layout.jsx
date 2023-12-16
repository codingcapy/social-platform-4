

import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Layout() {

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 mx-auto max-w-screen-xl px-2">
                <Outlet />
            </main>
            <Footer />
        </div>
    )

}