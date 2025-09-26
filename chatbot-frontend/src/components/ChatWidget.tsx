"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ChatWidget() {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!input.trim()) return setSuggestions([]);

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/chat/suggestions?q=${input}`);
        setSuggestions(res.data.suggestions);
        setSelectedIndex(-1);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [input]);

  const sendMessage = async (message?: string) => {
    const msg = message || input;
    if (!msg.trim()) return;

    setMessages([...messages, { from: "user", text: msg }]);
    setSuggestions([]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:3001/chat", { message: msg });
      setMessages((prev) => [...prev, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { from: "bot", text: "Oops! Something went wrong." }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0) {
          sendMessage(suggestions[selectedIndex]);
        } else {
          sendMessage();
        }
      }
    } else if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 border rounded-lg bg-black bg-opacity-80 shadow-lg">
      <div className="p-2 h-64 overflow-y-auto relative">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
            <span className="px-2 py-1 rounded bg-gray-800 text-white inline-block m-1">
              {m.text}
            </span>
          </div>
        ))}

        {suggestions.length > 0 && (
          <div className="absolute bg-black bg-opacity-90 border border-blue-400 shadow-lg rounded mt-1 w-[calc(100%-1rem)] max-h-40 overflow-y-auto z-50 neon-suggestions">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className={`px-2 py-1 cursor-pointer neon-text ${
                  selectedIndex === i ? "bg-blue-600 text-white" : "hover:bg-blue-500 hover:text-white"
                }`}
                onClick={() => sendMessage(s)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex border-t relative">
        <input
          ref={inputRef}
          className="flex-1 p-2 outline-none text-white bg-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button
          className="p-2 bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => sendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
