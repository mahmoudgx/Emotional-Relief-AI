"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatSession, setCurrentChatSession] =
    useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch chat sessions for authenticated users
  useEffect(() => {
    if (status === "authenticated") {
      fetchChatSessions();
    }
  }, [status]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatSession, streamingContent]);

  // Clean up event source on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const fetchChatSessions = async () => {
    try {
      const response = await fetch("/api/chat");
      if (!response.ok) {
        throw new Error("Failed to fetch chat sessions");
      }
      const data = await response.json();
      setChatSessions(data);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      setError("Failed to load chat sessions");
    }
  };

  const fetchChatSession = async (chatSessionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat?chatSessionId=${chatSessionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat session");
      }
      const data = await response.json();
      setCurrentChatSession(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching chat session:", error);
      setError("Failed to load chat session");
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError("");
    setStreamingContent("");
    setStreamingMessageId(null);

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

      if (currentChatSession) {
        setCurrentChatSession({
          ...currentChatSession,
          messages: [...currentChatSession.messages, userMessage],
        });
      } else {
        // Create a temporary chat session
        const tempSession: ChatSession = {
          id: "temp-" + Date.now(),
          title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
          messages: [userMessage],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCurrentChatSession(tempSession);
      }

      // Set up server-sent events with the message data included in the URL
      const queryParams = new URLSearchParams({
        t: Date.now().toString(),
        message: message,
        ...(currentChatSession?.id
          ? { chatSessionId: currentChatSession.id }
          : {}),
      });

      console.log("Creating EventSource with params:", queryParams.toString());
      const eventSource = new EventSource(
        `/api/chat/stream?${queryParams.toString()}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("EventSource connection opened");
      };

      eventSource.onmessage = (event) => {
        try {
          console.log("SSE message received:", event.data);
          const data = JSON.parse(event.data);
          console.log("Parsed data:", data);

          if (data.error) {
            console.error("SSE error from server:", data.error);
            setError(data.error);
            eventSource.close();
            return;
          }

          if (data.done) {
            console.log("Streaming complete, fetching updated chat session");
            // Streaming is complete, fetch the updated chat session
            fetchChatSession(data.chatSessionId);
            fetchChatSessions();
            eventSource.close();
            setIsLoading(false);
            setStreamingContent("");
            setStreamingMessageId(null);
            return;
          }

          // Update the streaming content
          if (data.content) {
            console.log("Updating streaming content with:", data.content);
            setStreamingContent((prev) => {
              const newContent = prev + data.content;
              console.log("New streaming content:", newContent);
              return newContent;
            });
          }

          // Store the message ID for the first message
          if (!streamingMessageId && data.messageId) {
            console.log("Setting streaming message ID:", data.messageId);
            setStreamingMessageId(data.messageId);
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      eventSource.onerror = () => {
        console.error("SSE error");
        setError("Connection error. Please try again.");
        eventSource.close();
        setIsLoading(false);
      };

      setMessage("");
    } catch (error) {
      console.error("Error setting up streaming:", error);
      setError("Failed to set up streaming");
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatSession(null);
    setMessage("");
    setStreamingContent("");
    setStreamingMessageId(null);
  };

  const handleDeleteChat = async (chatSessionId: string) => {
    // Show confirmation dialog
    if (!window.confirm("Are you sure you want to delete this chat?")) {
      return; // User cancelled the deletion
    }

    try {
      const response = await fetch(
        `/api/chat/delete?chatSessionId=${chatSessionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete chat session");
      }

      // If the deleted session is the current one, reset to null
      if (currentChatSession?.id === chatSessionId) {
        setCurrentChatSession(null);
      }

      // Refresh the chat sessions list
      fetchChatSessions();
    } catch (error) {
      console.error("Error deleting chat session:", error);
      setError("Failed to delete chat session");
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

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Show chat interface for authenticated users
  if (status === "authenticated") {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Button onClick={handleNewChat} className="w-full">
              New Chat
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatSessions.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No chat sessions yet
              </div>
            ) : (
              <ul>
                {chatSessions.map((session) => (
                  <li key={session.id} className="relative">
                    <Button
                      onClick={() => fetchChatSession(session.id)}
                      variant="ghost"
                      className={`w-full justify-start h-auto p-3 pr-10 ${
                        currentChatSession?.id === session.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium truncate">
                          {session.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(session.createdAt)}
                        </div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => handleDeleteChat(session.id)}
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-3 text-gray-400 hover:text-red-500"
                      title="Delete chat"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-semibold">
              {currentChatSession
                ? currentChatSession.title
                : "New Conversation"}
            </h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChatSession ? (
              <>
                {currentChatSession.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3/4 p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          msg.role === "user"
                            ? "text-blue-200"
                            : "text-gray-500"
                        }`}
                      >
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Streaming message */}
                {streamingContent && (
                  <div className="flex justify-start">
                    <div className="max-w-3/4 p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                      <p className="whitespace-pre-wrap">{streamingContent}</p>
                      <div className="text-xs mt-1 text-gray-500">
                        {formatDate(new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to Emotional Relief AI
                </h2>
                <p className="text-gray-600 mb-6">
                  Share your feelings, frustrations, or stressors, and
                  I&apos;;ll help you process them.
                </p>
                <div className="max-w-md text-gray-500">
                  <p className="mb-2">You can talk about:</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Work-related stress or conflicts</li>
                    <li>Frustrations with daily life</li>
                    <li>Feelings of anger or irritation</li>
                    <li>Anxiety about upcoming events</li>
                    <li>Any negative emotions you&apos;;d like to release</li>
                  </ul>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2 bg-red-50 border-t border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !message.trim()}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Release Your Negative Emotions
        </h1>
        <p className="mb-8 max-w-2xl text-xl text-gray-600">
          Talk to our AI companion about your stress, anger, or frustration. Get
          emotional relief and continue your day with a clearer mind.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Our AI companion is here to listen and help you process your
              emotions.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Create an Account
              </h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Sign up for a free account to get started with our emotional
                relief AI.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Share Your Feelings
              </h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Talk about what&apos;;s bothering you in a safe, private
                conversation.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Feel Better
              </h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Experience emotional relief and continue your day with a clearer
                mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
