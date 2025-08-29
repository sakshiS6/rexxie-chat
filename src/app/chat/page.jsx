"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const ChatPage = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [connectionError, setConnectionError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState("public");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const eventSourceRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check authentication and initialize
    initializeChat();
  }, [router]);

  const initializeChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        router.push('/login');
        return;
      }

      console.log('User data from localStorage:', userData); // Log userData for debugging
      
      let parsedUser;
      try {
        parsedUser = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error, 'User data:', userData);
        // If parsing fails, clear invalid data and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      
      setUser(parsedUser);
      
      // Establish connection
      await establishConnection(token);
      
    } catch (error) {
      console.error('Initialization error:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const establishConnection = async (token) => {
    try {
      // Establish Server-Sent Events connection
      const eventSource = new EventSource(`https://rexxie-backend.onrender.com/api/chat/stream?token=${encodeURIComponent(token)}`);
      eventSourceRef.current = eventSource;
      
      eventSource.onopen = () => {
        setConnectionStatus("connected");
        setConnectionError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "init") {
            setMessages(data.messages || []);
          } else if (data.type === "message") {
            setMessages(prev => [...prev, data.message]);
          } else if (data.type === "users") {
            setActiveUsers(data.users?.filter((u) => u.id !== user?.id) || []);
          }
        } catch (error) {
          console.error("Error parsing server message:", error);
        }
      };

      eventSource.onerror = () => {
        setConnectionStatus("error");
        setConnectionError("Connection error. Please try again later.");
      };

    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus("error");
      setConnectionError("Failed to connect to chat server");
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setConnectionError("Image size must be less than 5MB");
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isSending || connectionStatus !== "connected") return;

    setIsSending(true);
    try {
      let imageData = "";
      
      if (selectedImage) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsDataURL(selectedImage);
        });
      }

      const token = localStorage.getItem('token');
      const response = await fetch('https://rexxie-backend.onrender.com/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: input.trim() || undefined,
          image: imageData || undefined,
          type: selectedImage ? 'image' : 'text',
          recipientId: selectedRecipient === "public" ? undefined : selectedRecipient,
        }),
      });

      if (response.ok) {
        setInput("");
        clearImage();
        setConnectionError(null);
      } else {
        const errorData = await response.json();
        setConnectionError(errorData.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setConnectionError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "text-green-600";
      case "connecting": return "text-yellow-600";
      case "disconnected": return "text-red-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected": return "Connected";
      case "connecting": return "Connecting...";
      case "disconnected": return "Disconnected";
      case "error": return "Connection Error";
      default: return "Unknown";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  const publicMessages = messages.filter(msg => !msg.isPrivate);
  const privateMessages = messages.filter(msg => msg.isPrivate);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Chat Dashboard</h2>
          <div className="flex gap-2">
            {user.role === 'admin' && (
              <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
                Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="p-2 bg-muted rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm">Status:</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Online Users */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Online Users ({activeUsers.length + 1})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-sm p-2 bg-primary/10 rounded flex items-center justify-between">
                <span>{user.username} (You)</span>
                <Badge variant="secondary">Online</Badge>
              </div>
              {activeUsers.map(activeUser => (
                <div key={activeUser.id} className="text-sm p-2 hover:bg-muted rounded cursor-pointer flex items-center justify-between">
                  <span>{activeUser.username}</span>
                  <Badge variant="secondary">Online</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div>
          <label className="block text-sm font-medium mb-2">Send to:</label>
          <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
            <SelectTrigger>
              <SelectValue placeholder="Everyone (Public)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Everyone (Public)</SelectItem>
              {activeUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.username} (Private)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Real-time Chat</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.username}</p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </div>
              <div className="text-xs text-muted-foreground">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </header>
        
        <Tabs defaultValue="public" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 w-fit">
            <TabsTrigger value="public">Public Chat</TabsTrigger>
            <TabsTrigger value="private">Private Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="public" className="flex-1 flex flex-col mt-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {publicMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-lg">No public messages yet.</p>
                  <p className="text-sm">Be the first to start the conversation!</p>
                </div>
              ) : (
                publicMessages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} currentUser={user.username} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </TabsContent>
          
          <TabsContent value="private" className="flex-1 flex flex-col mt-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {privateMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-lg">No private messages yet.</p>
                  <p className="text-sm">Send a private message to a friend!</p>
                </div>
              ) : (
                privateMessages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} currentUser={user.username} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </TabsContent>
        </Tabs>
        
        {connectionError && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          </div>
        )}
        
        {imagePreview && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Image to send:</span>
              <Button variant="outline" size="sm" onClick={clearImage}>
                Remove
              </Button>
            </div>
            <img src={imagePreview} alt="Preview" className="max-h-32 rounded" />
          </div>
        )}
        
        <footer className="border-t bg-card p-4">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={connectionStatus !== "connected" || isSending}
            >
              Photo
            </Button>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedRecipient === "public" ? "Type your message..." : `Private message to ${activeUsers.find(u => u.id === selectedRecipient)?.username}...`}
              className="flex-1"
              disabled={connectionStatus !== "connected" || isSending}
            />
            <Button
              onClick={sendMessage}
              disabled={(!input.trim() && !selectedImage) || connectionStatus !== "connected" || isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
