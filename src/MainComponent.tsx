import React, { KeyboardEvent, useState } from "react";
import CryptoJS from "crypto-js";
import { Card, CardContent, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Tooltip, ThemeProvider, createTheme, CssBaseline, } from "@mui/material";
import { useThemeContext } from "../contexts/ThemeContext";
import isValidUrl from "../utils/isValidUrl"

const MainComponent = () => {
    const [originalUrl, setOriginalUrl] = useState<string>("");
    const [shortenedUrl, setShortenedUrl] = useState<string>("");
    const [history, setHistory] = useState<{ originalUrl: string; hash: string }[]>([]);
    const [expandedUrl, setExpandedUrl] = useState<string>("");  // To display expanded URL
    const [errorMessage, setErrorMessage] = useState('');
    const { darkMode, toggleDarkMode } = useThemeContext();
    const [urlError, setUrlError] = useState(false); // State to track validation error
    const [helperText, setHelperText] = useState(''); // State for helper text
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const invErrorMessage = `Please enter a valid URL: ${originalUrl}`;
    const dupErrorMessage = `URL has already been shortened: ${originalUrl}`;
    const copyMessage = `Copied to Clipboard: ${shortenedUrl}`;

    //Enter Key acts the same as clicking the Button
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter') {
            handlePress();
        }
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setOriginalUrl(url);

        if (!url) {
            // No input, no error
            setUrlError(false);
            setHelperText('');
            return;
        }

        // Validate URL as the user types
        if (!isValidUrl(url)) {
            setUrlError(true);
            setHelperText('Please enter a valid URL: ' + `${url}`);
        } else {
            setUrlError(false);
            setHelperText('');
        }
    };

    // Check if the URL starts with "https://sur.ly/"
    const isSurlyUrl = originalUrl.startsWith("https://sur.ly/");

    const handlePress = async () => {
        if (isSurlyUrl) {
            //Expansion Logic
            expandUrl();
            setShortenedUrl("");
        } else {
            //Shortening Logic
            shortenUrl();
            setExpandedUrl("");
        }
    };

    const expandUrl = () => {
        const expanded = history.find((row) => row.hash === originalUrl);  // Look for match in history

        if (expanded) {
            setExpandedUrl(expanded.originalUrl);  // Set the original URL if found
        } else {
            setExpandedUrl("");  // If not found, clear the expanded URL
        }
    }

    const shortenUrl = () => {
        if (!originalUrl) {
            // No input, no error
            setUrlError(false);
            setHelperText('');
            return;
        }

        if (!isValidUrl(originalUrl)) {
            setErrorMessage(invErrorMessage);
            setSnackbarOpen(true);
            return; // Prevent further processing
        }

        setUrlError(false);
        setHelperText('');
        const hash = CryptoJS.MD5(originalUrl).toString().slice(0, 6);
        const shortURL = `https://sur.ly/${hash}`;

        // Check for duplicate URL in history
        const isDuplicate = history.some(entry => entry.originalUrl === originalUrl);

        if (isDuplicate) {
            console.log(originalUrl);
            setErrorMessage(dupErrorMessage);
            setSnackbarOpen(true);
            return;
        }

        setShortenedUrl(shortURL);

        // Add the new hash to the history
        setHistory(prevHistory => [...prevHistory, { originalUrl, hash: shortURL }]);
    };

    // Copy shortened URL to clipboard
    const handleCopy = (shortenedUrl: string) => {
        navigator.clipboard.writeText(shortenedUrl).then(() => { });
        setErrorMessage(copyMessage);
        setSnackbarOpen(true);
    };

    return (
        <Box>
            {/* Dark Mode Toggle Button */}
            <Button
                onClick={() => {
                    toggleDarkMode()
                }}
                variant="contained"
                sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1 }}
            >
                {darkMode ? "Change to Light Mode" : "Change to Dark Mode"}
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
                            label={isSurlyUrl ? "sur.ly URL to Expand" : "Enter URL to Shorten"}
                            variant="outlined"
                            value={originalUrl}
                            onChange={handleUrlChange}
                            onKeyDown={handleKeyDown}
                            helperText={helperText} // Show error message
                            error={urlError} // Show red error if invalid
                            sx={{
                                mb: 2,
                                borderRadius: "8px",
                                "& .Mui-error": {
                                    // Prevent resizing or height changes when error is triggered
                                    paddingBottom: 0, // Remove padding for error message to stop resizing
                                },
                                minHeight: "85px",  //Reserve some space for the helpText
                            }}
                            slotProps={{
                                input: {
                                    sx: {
                                        height: "auto", // Maintain consistent height
                                    },
                                },
                            }}
                        />
                        <Tooltip title="Click to shorten your URL" arrow>
                            <Button variant="contained" color="primary" fullWidth onClick={handlePress} sx={{ mb: 2 }}>
                                {isSurlyUrl ? "Expand URL" : "Shorten URL"}  {/* Conditionally change button text */}
                            </Button>
                        </Tooltip>
                        {shortenedUrl && (
                            <Typography sx={{ mt: 2, wordBreak: "break-word" }}>
                                Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
                            </Typography>
                        )}
                        {expandedUrl && (
                            <Typography sx={{ mt: 2, wordBreak: "break-word" }}>
                                Expanded URL: <a href={expandedUrl} target="_blank" rel="noopener noreferrer">{expandedUrl} </a>
                            </Typography>
                        )}
                    </CardContent>
                </Card>
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
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.originalUrl}</TableCell>
                                    <TableCell>{item.hash}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleCopy(item.hash)}>
                                            Copy
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2500}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="warning"
                    sx={{
                        fontSize: "1.1rem",
                        borderRadius: "8px"
                    }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MainComponent;