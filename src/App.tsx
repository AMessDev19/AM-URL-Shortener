import React, { KeyboardEvent, useState } from "react";
import CryptoJS from "crypto-js";
import { Card, CardContent, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert   } from "@mui/material";

interface UrlDatabase {
  [key: string]: string;
}

const URLShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  //const [expandedUrl, setExpandedUrl] = useState<string>("");
  const [urlDatabase, setUrlDatabase] = useState<UrlDatabase>({});
  const [history, setHistory] = useState<{ originalUrl: string; hash: string }[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  //Enter Key acts the same as clicking the Button
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
        shortenUrl();
    }
  }

  const shortenUrl = () => {
    if (!originalUrl) return;
    const hash = CryptoJS.MD5(originalUrl).toString().slice(0, 6);
    setUrlDatabase((prev) => ({ ...prev, [hash]: originalUrl }));
    let shortURL = "https://sur.ly/" + `${hash}`;

    // Check for duplicate URL in history
    const isDuplicate = history.some(entry => entry.originalUrl === originalUrl);

    if (isDuplicate) {
        setSnackbarOpen(true); // Show duplicate warning
        return;
      }

    setShortenedUrl(shortURL);

    // Add the new hash to the history
    setHistory(prevHistory => [...prevHistory, { originalUrl, hash: shortURL }]);
  };

  return (
    //<AspectRatio objectFit="contain">
    <Box
      sx={{

        position: "fixed", // Ensures it covers the full screen
        top: 0,
        left: 0,
        width: "100vw", // Full viewport width
        height: "100vh", // Full viewport height
        backgroundImage: "url('https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: "100% 100%", // Stretches the image to fit without gaps
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",        
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 0, margin: 0, overflow: "hidden",
      }}
    >
      <Card sx={{ p: 3, mb: 4, backdropFilter: "blur(10px)", backgroundColor: "rgba(212, 212, 212, 0.75)", boxShadow: 3 }}>
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
            onKeyDown={handleKeyDown}
            sx={{ mb: 2, backgroundColor: "#ffffff",
                borderRadius: "8px", // Round edges
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent border
                  },
                  "&:hover fieldset": {
                    borderColor: "#000000", // Black border on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#90caf9", // Light blue focus border
                  },
                },
                input: { color: "#000" }, // Keep input text black
             }}
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
            <TableContainer component={Paper} sx={{ marginTop: 3, 
                                                    width: '75%', 
                                                    backgroundColor: "rgba(212, 212, 212, 0.75)",
                                                    borderRadius: "10px",
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Soft shadow for depth
            }}>
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

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2500} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
        <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity="warning"
            sx={{ 
            backgroundColor: "#c5c5c5",
            color: "#333333",       
            fontSize: "1.1rem",      
            borderRadius: "8px"       
            }}
        >
            URL has already been shortened.  See Below.
        </Alert>
        </Snackbar>
    </Box>
  );
};

export default URLShortener;
