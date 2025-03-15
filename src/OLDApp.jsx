import React, { useState } from "react";
import CryptoJS from "crypto-js";
import "./URLShortener.css"; // Import CSS file for styling

const urlDatabase = {}; // In-memory storage

export default function URLShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [expandedUrl, setExpandedUrl] = useState("");
  const [urlDatabase, setUrlDatabase] = useState({}); // Store URL mappings in state
  const surlyURLPrefix = "https://sur.ly";

  const shortenUrl = () => {
    if (!originalUrl) return;
    const hash = CryptoJS.MD5(originalUrl).toString().slice(0, 6);
    
    setUrlDatabase((prev) => ({
      ...prev,
      [hash]: originalUrl,
    }));
    
    setShortenedUrl(surlyURLPrefix + `/${hash}`);
  };

  const expandUrl = (shortId) => {
    var myShortId;

    //Pull the hash out of the User input
    if (shortId.length == 21){  //User entered entire URL
      myShortId = shortId.substring(shortId.length - 6);
    } else if (shortId.length != 6){  //User is either typing or entered something invalid
      return;
    }
      else {  //Len = 6, User entered a hash
      myShortId = shortId;
    }

    //Here we want myShortId to have only the hash, even if the user entered the entire url
    if (urlDatabase[myShortId]) {
      setExpandedUrl(urlDatabase[myShortId]);
    } else {
      setExpandedUrl("Error: URL not found");
    }
  };

  return (
    <div className="container">
      <div className="card" title="Enter the URL you wish to have shortened.">
        <h1 className="title">URL Shortener</h1>
        <input
          type="text"
          placeholder="Enter URL to shorten"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="input"
        />
        <button onClick={shortenUrl} className="button">Shorten URL</button>
        {shortenedUrl && (
          <p className="result">
            Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
          </p>
        )}
      </div>

      <div className="card" title="Enter the shortened URL to see the original.">
        <h2 className="subtitle">Expand Shortened URL</h2>
        <input
          type="text"
          placeholder="Enter short code"
          onChange={(e) => expandUrl(e.target.value)}
          className="input"
        />
        {expandedUrl && <p className="result">Original URL: {expandedUrl}</p>}
      </div>
    </div>
  );
}
