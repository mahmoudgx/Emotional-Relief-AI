"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
};

export default function ChatComponent() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Clean up event source on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Check if user has sent 2 messages already
    if (messageCount >= 2) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError("");
    setStreamingContent("");

    // Close any existing event source
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // Add the user message to the UI immediately
      const userMessage: Message = {
        id: "temp-" + Date.now(),
        content: message,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessageCount((prev) => prev + 1);

      // Set up server-sent events with the message data included in the URL
      const queryParams = new URLSearchParams({
        t: Date.now().toString(),
        message: message,
      });

      const eventSource = new EventSource(
        `/api/chat/guest?${queryParams.toString()}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("EventSource connection opened");
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            setError(data.error);
            eventSource.close();
            return;
          }

          if (data.done) {
            // Add the complete assistant message
            if (streamingContent) {
              const assistantMessage: Message = {
                id: data.messageId || "assistant-" + Date.now(),
                content: streamingContent,
                role: "assistant",
                createdAt: new Date().toISOString(),
              };
              setMessages((prev) => [...prev, assistantMessage]);
            }

            eventSource.close();
            setIsLoading(false);
            setStreamingContent("");
            return;
          }

          // Update the streaming content
          if (data.content) {
            setStreamingContent((prev) => prev + data.content);
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      eventSource.onerror = (event) => {
        console.error("SSE error", event);
        // Don't show error for unauthenticated users, just handle it gracefully
        setError("");

        // Add a fallback message if no response was received
        if (!streamingContent && messageCount > 0) {
          const fallbackMessage: Message = {
            id: "fallback-" + Date.now(),
            content:
              "I'm sorry, I couldn't process your message right now. Please try again later.",
            role: "assistant",
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, fallbackMessage]);
        }

        eventSource.close();
        setIsLoading(false);
        setStreamingContent("");
      };

      setMessage("");
    } catch (error) {
      console.error("Error setting up streaming:", error);
      setError("Failed to set up streaming");
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-blue-800">Chat with AI Assistant</CardTitle>
        {messageCount >= 2 && (
          <p className="text-sm font-medium text-amber-600 bg-amber-50 p-2 rounded-md mt-2 border border-amber-200">
            You&apos;ve sent {messageCount} messages. Please sign in to continue
            chatting.
          </p>
        )}
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
              <p className="text-blue-800 font-medium">
                Start a conversation with the AI assistant.
              </p>
              <p className="text-sm mt-2 text-blue-600">
                You can send 2 messages before signing in.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      msg.role === "user" ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Streaming message */}
          {streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-lg bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm">
                <p className="whitespace-pre-wrap">{streamingContent}</p>
                <div className="text-xs mt-1 text-gray-500">
                  {formatDate(new Date().toISOString())}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      {error && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-200">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
      <CardFooter className="border-t bg-gray-50 p-4">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading || messageCount >= 2}
            className="flex-1 border-gray-300 focus:border-blue-400 shadow-sm"
          />
          <Button
            type={messageCount >= 2 ? "button" : "submit"}
            onClick={
              messageCount >= 2 ? () => router.push("/login") : undefined
            }
            disabled={isLoading || (!message.trim() && messageCount < 2)}
            className={`font-medium px-6 ${
              messageCount >= 2
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Sending..." : messageCount >= 2 ? "Sign In" : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
