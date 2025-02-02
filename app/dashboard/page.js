// pages/page.js
'use client'

import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { marked } from 'marked';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [loading, setLoading] = useState(false); // Commented out loading state
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark'); // Theme state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        fetchMessages(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMessages = async (userId) => {
    // setLoading(true); // Removed loading state
    const messagesDoc = await getDoc(doc(db, 'users', userId, 'messages', 'chat'));
    if (messagesDoc.exists()) {
      setMessages(messagesDoc.data().messages || []);
    } else {
      const initialMessages = [
        {
          role: 'assistant',
          content: "Hi! I'm your Health Assistant AI Assistant. How can I help you today?",
        },
      ];
      setMessages(initialMessages);
      await setDoc(doc(db, 'users', userId, 'messages', 'chat'), { messages: initialMessages });
    }
    // setLoading(false); // Removed loading state
  };

  const sendMessage = async () => {
    // setLoading(true); // Removed loading state
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setMessage('');

    const newMessage = { role: 'user', content: message };
    const placeholderResponse = { role: 'assistant', content: '' };

    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
      placeholderResponse,
    ]);

    try {
      // Fetch user's health profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const healthProfile = userDoc.data()?.healthProfile || {};

      const response = await fetch('../api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          healthProfile: healthProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });

        setMessages((prevMessages) => {
          let lastMessageIndex = prevMessages.length - 1;
          let updatedMessages = [...prevMessages];
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            content: assistantMessage,
          };
          return updatedMessages;
        });
      }

      await updateDoc(doc(db, 'users', user.uid, 'messages', 'chat'), {
        messages: [...messages, newMessage, { role: 'assistant', content: assistantMessage }],
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
    // setLoading(false); // Removed loading state
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSignOut = async () => {
    // setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      router.push('/'); // Redirect to the homepage or a sign-in page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.'); // Show a user-friendly error message
    }
    // setLoading(false);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: '#F8FAFB', // Light blue-grey background
        color: '#2C3E50',
        mt: '64px',
        backgroundImage: 'linear-gradient(to bottom right, #F8FAFB, #E8F4F8)'
      }}
    >
      {/* Commented out loading overlay
      {loading && (
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="absolute"
          top={0}
          left={0}
          bgcolor="rgba(44, 62, 80, 0.3)"
          zIndex={9999}
        >
          <Loader />
        </Box>
      )}
      */}
      <Stack
        direction={'column'}
        width="100vw"
        height="100vh"
        p={3}
        spacing={3}
        sx={{
          border: 'none',
          boxShadow: '0 0 20px rgba(0,0,0,0.05)'
        }}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#3498db',
              borderRadius: '10px',
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Card
                sx={{
                  maxWidth: '70%',
                  bgcolor: message.role === 'assistant' ? '#FFFFFF' : '#3498db',
                  borderRadius: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  padding: '3px',
                  margin: '5px',
                  position: 'relative',
                  '&::before': message.role === 'assistant' ? {
                    content: '""',
                    position: 'absolute',
                    left: '-10px',
                    top: '50%',
                    border: '10px solid transparent',
                    borderRight: '10px solid #FFFFFF',
                    transform: 'translateY(-50%)',
                  } : {
                    content: '""',
                    position: 'absolute',
                    right: '-10px',
                    top: '50%',
                    border: '10px solid transparent',
                    borderLeft: '10px solid #3498db',
                    transform: 'translateY(-50%)',
                  }
                }}
              >
                <CardContent>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      color: message.role === 'assistant' ? '#2C3E50' : '#FFFFFF',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                    }}
                    dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                  />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Stack>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'rgba(248, 250, 251, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            padding: '20px 0',
            borderTop: '1px solid rgba(52, 152, 219, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '70%',
              maxWidth: '800px',
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="outlined"
              placeholder="Ask your health-related question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF',
                  borderRadius: '30px',
                  '& fieldset': {
                    borderColor: 'rgba(52, 152, 219, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3498db',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3498db',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={isLoading}
              sx={{
                minWidth: '50px',
                minHeight: '50px',
                backgroundColor: '#3498db',
                color: '#FFFFFF',
                borderRadius: '50%',
                marginLeft: '15px',
                boxShadow: '0 2px 10px rgba(52, 152, 219, 0.3)',
                '&:hover': {
                  backgroundColor: '#2980b9',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}