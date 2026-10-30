import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const Chatbox = () => {
  const containerRef = useRef(null);
  const { selectedChat, theme } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setLoading(true);

    try {
      // TODO: Replace with your API call
      const newMessage = {
        role: "user",
        content: prompt,
      };

      setMessages((prev) => [...prev, newMessage]);

      console.log({
        prompt,
        mode,
        isPublished,
      });

      setPrompt("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 mt-14 2xl:pr-40">
      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="Logo"
              className="w-full max-w-56 sm:max-w-64"
            />

            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me Anything
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message key={index} message={message} />
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 py-4">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>

      {/* Publish Checkbox */}

      {mode === "image" && (
        <label className="flex items-center gap-2 mb-3 mx-auto text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-purple-600"
          />

          <span>Publish generated image to Community</span>
        </label>
      )}

      {/* Prompt Form */}
      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex items-center gap-4"
      >
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);

            if (e.target.value === "text") {
              setIsPublished(false);
            }
          }}
          className="text-sm outline-none bg-transparent"
        >
          <option value="text" className="dark:bg-purple-900">
            Text
          </option>

          <option value="image" className="dark:bg-purple-900">
            Image
          </option>
        </select>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          className="flex-1 w-full text-sm outline-none bg-transparent"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="disabled:opacity-50"
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="Send"
            className="w-8 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
