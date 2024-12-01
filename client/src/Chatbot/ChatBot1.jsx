"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "./button";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ChatBot() {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const VITE_API_KEY = "AIzaSyCeJ9_qfaeSDbUhzXZnni_CAgCLci_lkhw";
  const genAI = new GoogleGenerativeAI(VITE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  let history = [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  async function getResponse(prompt) {
    const chat = await model.startChat({
      history: history.map((item) => ({
        ...item,
        parts: [{ text: item.parts }],
      })),
    });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text().replace(/\*/g, "");
    const limitedText = text.split(".").slice(0, 5).join(".") + ".";
    console.log(limitedText);
    return limitedText;
  }

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const prompt = userMessage.trim();
    if (prompt === "") return;

    setLoading(true);
    console.log("user message", prompt);

    setMessages((prevMessages) => [...prevMessages, { user: prompt }]);
    setUserMessage("");

    try {
      const aiResponse = await getResponse(prompt);
      setMessages((prevMessages) => [...prevMessages, { bot: aiResponse }]);
      history.push({ role: "user", parts: prompt });
      history.push({ role: "model", parts: aiResponse });
      console.log(history);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { bot: "Sorry, I encountered an error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: "#f9f9f9" }} // Light background color
    >
      <div
        className="flex flex-col w-full max-w-md h-[600px] bg-white rounded-xl shadow-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "600px",
          border: "2px solid transparent",
          borderRadius: "15px",
          backgroundClip: "padding-box",
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
          fontSize: "1.25rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow =
            "0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 40px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)";
        }}
      >
        <div className="bg-blue-600 p-4 text-white flex items-center">
          <h1 className="text-xl font-bold">SpotlyLife</h1>
        </div>

        <div className="flex-grow p-4 space-y-3 overflow-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.user ? "justify-end" : "justify-start"
              }`}
              style={{ marginBottom: "0.75rem" }}
            >
              {!message.user && (
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/robot-2.png"
                  alt="Bot Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  message.user
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                style={
                  message.user
                    ? {
                        backgroundColor: "#007bff",
                        fontFamily: "Montserrat, sans-serif",
                        color: "white",
                      }
                    : {
                        backgroundColor: "#e6e6e6",
                        fontFamily: "Montserrat, sans-serif",
                        color: "#333",
                      }
                }
              >
                <p>{message.user || message.bot}</p>
              </div>
              {message.user && (
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200"
        >
          <div
            className="flex items-center space-x-2"
            style={{
              border: "1px solid #d1d5db", // Light border
              borderRadius: "9999px", // Fully rounded
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
              padding: "0.5rem 1rem", // Padding for a spacious look
              backgroundColor: "#fff", // White background
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="flex-grow text-gray-800 focus:ring-2 focus:ring-blue-500 rounded-full outline-none"
              style={{
                fontSize: "1rem",
                padding: "0.5rem",
                backgroundColor: "transparent",
                color: "#333", // Dark text for readability
              }}
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 transform rotate-45" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
