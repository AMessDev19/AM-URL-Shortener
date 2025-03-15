import React, { KeyboardEvent, useState } from "react";
import CryptoJS from "crypto-js";
import { Card, CardContent, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Tooltip, ThemeProvider, createTheme, CssBaseline, } from "@mui/material";

interface UrlDatabase {
    [key: string]: string;
}

const URLShortener: React.FC = () => {
    const [originalUrl, setOriginalUrl] = useState<string>("");
    const [shortenedUrl, setShortenedUrl] = useState<string>("");
    const [urlDatabase, setUrlDatabase] = useState<UrlDatabase>({});
    const [history, setHistory] = useState<{ originalUrl: string; hash: string }[]>([]);
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}(\S*)?$/;
    const [urlSnackbarOpen, setUrlSnackbarOpen] = useState(false); // For invalid URL
    const [duplicateSnackbarOpen, setDuplicateSnackbarOpen] = useState(false); // For duplicate URL
    const [errorMessage, setErrorMessage] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    // Create a theme based on the dark mode state
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light', // Switch between light and dark mode
            primary: {
                main: darkMode ? '#90caf9' : '#1976d2', // Blue color for dark and light modes
            },
            background: {
                default: darkMode ? '#121212' : '#ffffff', // Custom background color for both modes
                paper: darkMode ? '#1d1d1d' : '#fafafa', // Paper background (cards, etc.)
            },
            text: {
                primary: darkMode ? '#ffffff' : '#000000', // White text in dark mode, black text in light mode
            },
        },
        components: {
            // Override input field colors
            MuiTextField: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkMode ? '#333' : '#fff', // Dark background for input in dark mode
                        color: darkMode ? '#fff' : '#000', // Text color
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkMode ? '#1976d2' : '#90caf9', // Button color changes based on mode
                        color: '#fff',
                    },
                },
            },
        },
    });

    //Enter Key acts the same as clicking the Button
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter') {
            shortenUrl();
        }
    }

    const shortenUrl = () => {
        if (!originalUrl) return;

        if (!urlPattern.test(originalUrl)) {
            setErrorMessage('Please enter a valid URL: ' + `${originalUrl}`);
            setUrlSnackbarOpen(true);
            return; // Prevent further processing
        }

        const hash = CryptoJS.MD5(originalUrl).toString().slice(0, 6);
        setUrlDatabase((prev) => ({ ...prev, [hash]: originalUrl }));
        let shortURL = "https://sur.ly/" + `${hash}`;

        // Check for duplicate URL in history
        const isDuplicate = history.some(entry => entry.originalUrl === originalUrl);

        if (isDuplicate) {
            setErrorMessage('URL has already been shortened: ' + `${originalUrl}`);
            setDuplicateSnackbarOpen(true); // Show duplicate warning
            return;
        }

        setShortenedUrl(shortURL);

        // Add the new hash to the history
        setHistory(prevHistory => [...prevHistory, { originalUrl, hash: shortURL }]);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Dark Mode Toggle Button */}
            <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="contained"
                sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1 }}
            >
                Toggle Dark Mode
            </Button>
            <Box
                sx={{
                    position: "fixed",
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
                <Card sx={{ p: 3, mb: 4, backdropFilter: "blur(10px)", boxShadow: 3 }}>
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
                            helperText="Make sure to include http:// or https://"
                            error={!urlPattern.test(originalUrl)}
                            sx={{
                                mb: 2,
                                borderRadius: "8px"
                            }}
                        />
                        <Tooltip title="Click to shorten your URL" arrow>
                            <Button variant="contained" color="primary" fullWidth onClick={shortenUrl} sx={{ mb: 2 }}>
                                Shorten URL
                            </Button>
                        </Tooltip>
                        {shortenedUrl && (
                            <Typography sx={{ mt: 2, wordBreak: "break-word"/*, color: "#1565c0"*/ }}>
                                Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* Snackbar for Invalid URL */}
                <Snackbar
                    open={urlSnackbarOpen}
                    autoHideDuration={2000}
                    onClose={() => setUrlSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setUrlSnackbarOpen(false)} severity="warning" sx={{
                        backgroundColor: "#c5c5c5",
                        fontSize: "1.1rem",
                        borderRadius: "8px"
                    }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
                {/* Table for displaying URL history */}
                <TableContainer component={Paper} sx={{
                    marginTop: 3,
                    width: '75%',
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
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
                    open={duplicateSnackbarOpen}
                    autoHideDuration={2500}
                    onClose={() => setDuplicateSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setDuplicateSnackbarOpen(false)}
                        severity="warning"
                        sx={{
                            fontSize: "1.1rem",
                            borderRadius: "8px"
                        }}
                    >
                        URL has already been shortened.  See Below.
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default URLShortener;
