"use client";

import { AppBar, Toolbar, Typography, Tabs, Tab, Button, Container, IconButton, CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function AnimeRecommender() {
  const [tabIndex, setTabIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const [accessToken] = useState(localStorage.getItem("anilist_token") || "");
  const [apiResponse, setApiResponse] = useState("");

  const fetchToken = async () => {
    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: 'query { Viewer { id }}'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setApiResponse(data);
      } else {        
      setApiResponse("Failed to fetch token:"+ response.statusText);
      }
    } catch (error) {
      setApiResponse("Error fetching token: " + error);
      console.error("Error fetching token:", error);
    }
  };

  const CLIENT_ID = "24301";
  const ANILIST_AUTH_URL = `https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&response_type=token`;

  const handleAnilistLogin = () => {
    window.location.href = ANILIST_AUTH_URL;
  };


const handleAuthRedirect = () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");
    if (accessToken) {
      localStorage.setItem("anilist_token", accessToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
};

useEffect(() => {
  handleAuthRedirect();
}, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Anime Recommender
          </Typography>
          <Tabs 
            value={tabIndex} 
            onChange={(_, newValue) => setTabIndex(newValue)} 
            textColor="inherit"
            centered
            sx={{ flexGrow: 1 }}
          >
            <Tab label="Recommendator" />
            <Tab label="Upcoming" />
            <Tab label="Most Popular" />
          </Tabs>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      {
        accessToken.length == 0 || accessToken.length == null ? (
          <Container sx={{ display: "flex", justifyContent: "center", mt: 4 , marginTop:36}}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAnilistLogin}
            startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/AniList_logo.svg/512px-AniList_logo.svg.png?20220330011134" alt="AniList Logo" width={24} height={24} />}
          >
            Sign in with AniList
          </Button>
        </Container>
        ) : (
          <Container sx={{ display: "flex", justifyContent: "center", mt: 4 , marginTop:36}}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchToken}           
          >Request</Button>
          <Typography variant="h6" sx={{ mt: 2 }}>{ JSON.stringify(apiResponse).length == 2 ? "" : JSON.stringify(apiResponse)}</Typography>
            </Container>
          )
      }
    
    </ThemeProvider>
  );
}