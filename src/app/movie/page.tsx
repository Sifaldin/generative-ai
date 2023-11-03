"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAsyncFn } from "react-use";

interface Message {
  text: string;
  role: "user" | "bot";
}

function ChatPage() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);

  const [{ value, loading }, search] = useAsyncFn<
    () => Promise<string>
  >(async () => {
    setConversation((prev) => [...prev, { text: query, role: "user" }]);
    const response = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, modelType: "movies" }),
    });
    const data = await response.json();

    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100); // Adjust the delay as needed

    return data.res.text;
  }, [query]);

  useEffect(() => {
    if (value) {
      setConversation((prev) => [...prev, { text: value, role: "bot" }]);
    }
  }, [value]);

  return (
    <main className="flex min-h-screen flex-col items-center p-5 lg:p-24 w-full mx-auto">
      <h1 className="text-4xl font-bold text-center">AI Movie Master</h1>
      <div
        ref={chatContainerRef}
        className="chat-container w-100 min-w-full min-h-full p-2 h-96 overflow-y-auto mt-8"
      >
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col  bg-gray-900 p-3 rounded-md items-${
              message.role === "bot" ? "start" : "end"
            } mb-2`}
          >
            <p
              className={`text-lg font-semibold ${
                message.role === "bot" ? "text-blue-600" : "text-light-blue-600"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          search();
          setInputValue("");
        }}
      >
        <input
          type="text"
          name="search"
          className="border-2 border-gray-300 bg-black mt-3 h-10 rounded-lg text-sm focus:outline-none w-50"
          style={{ width: "1000px" }}
          placeholder=""
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setQuery(e.target.value);
          }} // Update inputValue state
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </form>
    </main>
  );
}

export default ChatPage;
