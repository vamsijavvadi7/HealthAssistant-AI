'use client'
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography
} from "@mui/material";
import { signInWithPopup, signOut } from 'firebase/auth';
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Loader from './components/Loading';
import { auth, provider } from './firebase';
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  
  const [userloading, setUserloading] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState(null);

  const handleSignIn = async () => {
    setUserloading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard'); // Redirect to a dashboard or another page after signing in
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.'); // Show a user-friendly error message
    }
    setUserloading(false);
  };

  const handleSignOut = async () => {
    setUserloading(true);
    try {
      await signOut(auth);
      setUser(null);
      router.push('/'); // Redirect to the homepage or a sign-in page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.'); // Show a user-friendly error message
    }
    setUserloading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
       <Head>
       <title>Health Assistant AI</title>
        <meta name="description" content="Health Assistant AI is AI assistant website which would help you to manage your health" />
        <link rel="icon" href="/icon2.png" type="image/png" /> {/* Link to your favicon */}
      </Head>
      <body className={inter.className}>
        {userloading ? (
          <Box
            width="100vw"
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              background: 'rgba(0.5)', // Semi-transparent black background
              overflow: 'hidden',
              position: 'relative',
              zIndex: 9999, // Ensure it overlays other content
            }}
          >
            <Loader />
          </Box>
        ) : (
          <>
            <AppBar
              sx={{
                background: 'linear-gradient(45deg, #0066cc 30%, #0099ff 90%)',
                boxShadow: '0 3px 15px rgba(0,102,204,0.3)',
              }}
              position="fixed"
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{ flexGrow: 1 }}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    fontSize: "1.2rem",
                    margin: "10px 0",
                  }}
                >
                  Health Assistant AI
                </Typography>
                {user ?  (
                  <Button
                    variant="contained"
                    sx={{
                      maxWidth: '10vw',
                      minWidth: '100px',
                      background: 'white',
                      color: '#0066cc',
                      fontWeight: 600,
                      borderRadius: '25px',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 5px 20px rgba(0,102,204,0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                ) : ( 
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'white',
                        fontWeight: 500,
                      }}
                    >
                      Existing User?
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        maxWidth: '10vw',
                        minWidth: '100px',
                        background: 'white',
                        color: '#0066cc',
                        fontWeight: 600,
                        borderRadius: '25px',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 5px 20px rgba(0,102,204,0.4)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={handleSignIn}
                    >
                      Sign In
                    </Button>
                  </Box>
                )}
              </Toolbar>
            </AppBar>
            {children}
          </>
        )}
      </body>
    </html>
  );
}
