import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate } =
    useAppContext();

  const [search, setSearch] = useState("");

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-6 border-r border-[#80609F]/20 backdrop-blur-3xl shadow-2xl transition-all duration-500 max-md:absolute left-0 z-10 
      ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#242124]/40 to-[#000000]/40"
          : "bg-white"
      }
      ${!isMenuOpen && "max-md:-translate-x-full"}`}
    >
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="Logo"
        className="w-full max-w-48 mb-8 cursor-pointer hover:scale-105 transition-all duration-300"
      />

      {/* New Chat Button */}
      <button className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 px-5 py-3 text-white font-semibold shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300">
        <span className="text-xl">+</span>
        <span>New Chat</span>
      </button>

      {/* Search */}
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#80609F]/20 bg-gray-100 dark:bg-white/5 px-4 py-3 backdrop-blur-md">
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-4 opacity-70 dark:invert"
        />

        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversation"
          className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-400"
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && (
        <p className="mt-6 mb-3 text-xs uppercase tracking-wider text-gray-500 dark:text-[#B1A6C0]">
          Recent Chat
        </p>
      )}

      <div className="flex flex-col gap-1 overflow-y-auto">
        {chats
          .filter((chat) =>
            chat.messages?.[0]
              ? chat.messages[0].content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase()),
          )
          .map((chat) => (
            <div
              onClick={()=>{navigate('/');setSelectedChat(chat);setIsMenuOpen(false)}}
              key={chat._id}
              className="group flex items-center justify-between rounded-xl p-3 mb-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
            >
              <div className="overflow-hidden">
                <p className="truncate w-full text-sm font-medium text-gray-800 dark:text-white">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              <img
                src={assets.bin_icon}
                alt="Delete"
                className="w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer"
              />
            </div>
          ))}
      </div>

      {/* Community */}
      <div
        onClick={() => {navigate("/Community");setIsMenuOpen(false)}}
        className="mt-auto flex items-center gap-3 rounded-2xl border border-[#80609F]/20 bg-gray-100 dark:bg-white/5 px-4 py-3 backdrop-blur-md cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-[1.02] transition-all duration-300"
      >
        <img
          src={assets.gallery_icon}
          alt="Community"
          className="w-5 dark:invert"
        />

        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            Community
          </p>
          <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
            Explore AI Images
          </p>
        </div>
      </div>

      {/* Credits */}
      <div
        onClick={() => {navigate("/Credits");setIsMenuOpen(false)}}
        className="mt-2 flex items-center gap-3 rounded-2xl border border-[#80609F]/20 bg-gray-100 dark:bg-white/5 px-4 py-3 backdrop-blur-md cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-[1.02] transition-all duration-300"
      >
        <img
          src={assets.diamond_icon}
          alt="Credits"
          className="w-5 dark:invert"
        />

        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            Credits: {user?.credits}
          </p>

          <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
            Purchase credits to use A18GPT
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-[#80609F]/20 bg-gray-100 dark:bg-white/5 px-4 py-3 backdrop-blur-md">
        <p className="flex items-center gap-2 text-sm text-gray-800 dark:text-white">
          <img
            src={assets.theme_icon}
            alt="Theme"
            className="w-4 dark:invert"
          />
          Dark
        </p>

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />

          <div className="w-9 h-5 bg-gray-400 rounded-full transition-all peer-checked:bg-purple-600"></div>

          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <img src={assets.user_icon} className="w-7 rounded-full" alt="User" />

        <p className="flex-1 text-sm dark:text-primary truncate">
          {user ? user.name : "Login your account"}
        </p>

        {user && (
          <img
            src={assets.logout_icon}
            alt="Logout"
            className="h-5 cursor-pointer hidden group-hover:block dark:invert"
          />
        )}
      </div>

      {/* Mobile Close Button */}
      <img
        onClick={() => {
          setIsMenuOpen(false);
        }}
        src={assets.close_icon}
        alt="Close"
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden dark:invert"
      />
    </div>
  );
};

export default Sidebar;
