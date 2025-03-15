import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { Container, Card, CardContent, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper  } from "@mui/material";
import AspectRatio from '@mui/joy/AspectRatio';

interface UrlDatabase {
  [key: string]: string;
}

const URLShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  const [expandedUrl, setExpandedUrl] = useState<string>("");
  const [urlDatabase, setUrlDatabase] = useState<UrlDatabase>({});
  const [history, setHistory] = useState<{ originalUrl: string; hash: string }[]>([]);

  const shortenUrl = () => {
    if (!originalUrl) return;
    const hash = CryptoJS.MD5(originalUrl).toString().slice(0, 6);
    setUrlDatabase((prev) => ({ ...prev, [hash]: originalUrl }));
    let shortURL = "https://sur.ly/" + `${hash}`;
    setShortenedUrl(shortURL);

    // Add the new hash to the history
    setHistory(prevHistory => [...prevHistory, { originalUrl, hash: shortURL }]);
  };

  return (
    <AspectRatio objectFit="contain">
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 0, margin: 0, overflow: "hidden",
      }}
    >
      <Card sx={{ p: 3, mb: 4, backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.85)", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            URL Shortener
          </Typography>
          <TextField
            fullWidth
            label="Enter URL to shorten"
            variant="outlined"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={shortenUrl} sx={{ mb: 2 }}>
            Shorten URL
          </Button>
          {shortenedUrl && (
            <Typography sx={{ mt: 2, wordBreak: "break-word", color: "#1565c0" }}>
              Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
            </Typography>
          )}
        </CardContent>
      </Card>

            {/* Table for displaying URL history */}
            <TableContainer component={Paper} sx={{ marginTop: 3, width: '75%'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Original URL</strong></TableCell>
              <TableCell><strong>Shortened URL</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.originalUrl}</TableCell>
                <TableCell>{item.hash}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </AspectRatio>
  );
};

export default URLShortener;
