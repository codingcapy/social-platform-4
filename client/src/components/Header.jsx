
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: Header component for CapySocial2
 */

import { NavLink } from "react-router-dom"
import { useState } from "react";
import useAuthStore from "../store/AuthStore"
import { getUserIdFromToken } from "../services/jwt.service"
import useSearchStore from "../store/SearchStore"
import { IoHomeSharp } from "react-icons/io5";
import { RxMagnifyingGlass } from "react-icons/rx";
import cocodog from "/cocodog.png"

export default function Header() {

    const { logoutService, user } = useAuthStore((state) => state)
    const userId = user?.userId || null
    const { content, setContent } = useSearchStore((state) => state)
    const [expandedMenu, setExpandedMenu] = useState(window.innerWidth > 500 ? true : false)

    function toggleMenu() {
        setExpandedMenu(!expandedMenu)
    }

    return (
        <header className="sticky z-50 top-0 md:flex justify-between bg-gradient-to-r from-purple-900 to-pink-900 text-white">
            {expandedMenu && <div className="flex flex-col md:flex-row">
                <NavLink to="/" className="text-center py-4 px-5 mx-auto" onClick={() => setExpandedMenu(window.innerWidth < 500 ? false : true)}><div className="flex"><img src={cocodog} className="w-10 h-auto max-w-xs pr-2" /> CocoDogo</div></NavLink>
                <NavLink to="/" className="flex py-2 md:py-4 mx-auto" onClick={() => setExpandedMenu(window.innerWidth < 500 ? false : true)}><IoHomeSharp size={20} className=" text-center mx-2" /> Home</NavLink>
            </div >}
            {expandedMenu && <div className="w-80 mx-auto md:mx-0">
                <div className="flex px-2 mt-3 border rounded-lg    py-1"><RxMagnifyingGlass size={25} className="" /> <input type="text" className="bg-transparent  focus:outline-none flex-grow" placeholder="Search CocoDogo" onChange={(e) => setContent(e.target.value)} /></div>
            </div>}
            {expandedMenu && <div className="flex flex-col md:block md:py-4">
                <NavLink to="/posts" className="text-center py-2 md:py-4 px-5" onClick={() => setExpandedMenu(window.innerWidth < 500 ? false : true)}>Posts</NavLink>
                {user && <NavLink to="/posts/create" className="text-center py-2 md:py-4 px-5" onClick={() => setExpandedMenu(window.innerWidth < 500 ? false : true)}>Create</NavLink>}
            </div>}
            {expandedMenu && <div className="flex flex-col md:block md:py-4">
                {!user && <NavLink to="/users/login" className="text-center py-2 md:py-4 px-5" onClick={() => setExpandedMenu(window.innerWidth < 500 ? false : true)}>Login</NavLink>}
                {!user && <NavLink to="/users/signup" className="text-center py-2 md:py-4 px-5" onClick={() => setExpandedMenu(window.innerWidth < 500 ? false : true)}>Signup</NavLink>}
                {user && <NavLink to={`/users/${userId}`} className="text-center py-2 md:py-4 px-5" onClick={() => setExpandedMenu(window.innerWidth < 500 ? false : true)}>{user.username}</NavLink>}
                {user && <NavLink to="/" onClick={logoutService} className="text-center py-2 md:py-4 px-5">Logout</NavLink>}
            </div>}
            {expandedMenu && <div onClick={toggleMenu} className="text-center py-2 md:py-4 text-2xl md:hidden">&#127828;</div>}
            <div className="flex justify-between md:hidden">
                {!expandedMenu && <NavLink to="/" className="py-2 px-2 md:hidden"><div className="flex"><img src={cocodog} className="w-10 h-auto max-w-xs pr-2" /></div></NavLink>}
                {!expandedMenu && <div onClick={toggleMenu} className="text-3xl md:hidden">&#127828;</div>}
            </div>
        </header>
    )
}