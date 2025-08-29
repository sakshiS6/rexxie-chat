"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    const storedUser = localStorage.getItem('user');
    
    if (!storedSessionId || !storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'admin') {
      router.push('/chat');
      return;
    }

    setSessionId(storedSessionId);
    setUser(userData);
    
    // Verify session and load data
    verifySession(storedSessionId);
  }, [router]);

  const verifySession = async (sessionId) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify',
          sessionId,
        }),
      });

      if (!response.ok) {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      loadUsers(sessionId);
      loadMessages();
    } catch (error) {
      console.error('Session verification error:', error);
      router.push('/login');
    }
  };

  const loadUsers = async (sessionId) => {
    try {
      const response = await fetch(`/api/auth?action=get_users&sessionId=${sessionId}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`
        },
        body: JSON.stringify({
          action: 'create_user',
          sessionId,
          newUser: {
            username: newUsername.trim(),
            password: newPassword.trim(),
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`User "${newUsername}" created successfully!`);
        setNewUsername("");
        setNewPassword("");
        loadUsers(sessionId);
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'logout',
          sessionId,
        }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const goToChat = () => {
    router.push('/chat');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.username}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={goToChat}>
              Go to Chat
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="messages">Message Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="newUsername" className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      <Input
                        id="newUsername"
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter username"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter password"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading || !newUsername.trim() || !newPassword.trim()}
                  >
                    {isLoading ? "Creating..." : "Create User"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Users ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.username}</span>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          {!user.isActive && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Messages ({messages.length})</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monitor all conversations between users
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No messages yet</p>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.sender}</span>
                            {message.isPrivate && (
                              <Badge variant="outline">
                                Private to {message.recipient}
                              </Badge>
                            )}
                            <Badge variant={message.type === 'image' ? 'secondary' : 'default'}>
                              {message.type}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {message.text && (
                          <p className="text-sm">{message.text}</p>
                        )}
                        {message.image && (
                          <div className="mt-2">
                            <img 
                              src={message.image} 
                              alt="Shared content" 
                              className="max-w-32 max-h-32 rounded object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <p className="text-sm text-muted-foreground">
                    {users.filter(u => u.role === 'admin').length} admin(s), {users.filter(u => u.role === 'user').length} user(s)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{messages.length}</div>
                  <p className="text-sm text-muted-foreground">
                    {messages.filter(m => !m.isPrivate).length} public, {messages.filter(m => m.isPrivate).length} private
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media Shared</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{messages.filter(m => m.type === 'image').length}</div>
                  <p className="text-sm text-muted-foreground">
                    Images shared by users
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
