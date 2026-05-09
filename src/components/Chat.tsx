"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, TextField, IconButton, Avatar, List, ListItem, ListItemAvatar } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

interface Message {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  createdAt: Date | string;
  sender: User;
}

interface ChatProps {
  groupId: string;
  initialMessages: Message[];
  currentUserId: string;
}

export default function Chat({ groupId, initialMessages, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!groupId) return;

    let timerId: NodeJS.Timeout;

    const refreshMessages = async () => {
      try {
        const res = await fetch(`/api/messages?groupId=${encodeURIComponent(groupId)}`, {
          cache: "no-store",
        });

        // Stop polling on auth errors; don't crash on HTML responses
        if (!res.ok) {
          if (res.status === 401) clearTimeout(timerId);
          return;
        }
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) return;

        const serverMessages = (await res.json()) as Message[];
        
        // Only update if something changed (last message ID or length)
        setMessages((prev) => {
          if (prev.length === serverMessages.length && 
              prev[prev.length - 1]?.id === serverMessages[serverMessages.length - 1]?.id) {
            return prev;
          }
          return serverMessages;
        });
      } catch (error) {
        console.error("Error refreshing messages:", error);
      } finally {
        timerId = setTimeout(refreshMessages, 3000);
      }
    };

    refreshMessages();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [groupId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      const savedMessage = (await res.json()) as Message;
      setMessages((prev) => {
        if (prev.some((m) => m.id === savedMessage.id)) return prev;
        return [...prev, savedMessage];
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px', maxHeight: '500px', borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6" fontWeight="bold">Team Chat</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f4f6f8' }}>
        <List sx={{ p: 0 }}>
          {messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <ListItem 
                key={msg.id || index} 
                sx={{ 
                  flexDirection: isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  px: 0,
                  mb: 2
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40, ml: isMe ? 2 : 0, mr: isMe ? 0 : 2 }}>
                  <Avatar src={msg.sender?.image || ""} sx={{ width: 32, height: 32 }} />
                </ListItemAvatar>
                <Box sx={{ 
                  maxWidth: '70%', 
                  bgcolor: isMe ? 'primary.main' : 'white', 
                  color: isMe ? 'primary.contrastText' : 'text.primary',
                  p: 1.5, 
                  borderRadius: 2,
                  boxShadow: 1
                }}>
                  {!isMe && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>{msg.sender?.name || 'User'}</Typography>}
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{msg.content}</Typography>
                </Box>
              </ListItem>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoComplete="off"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
        />
        <IconButton type="submit" color="primary" disabled={!newMessage.trim()} sx={{ bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
