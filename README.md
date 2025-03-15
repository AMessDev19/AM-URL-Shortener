# URL Shortener App

A simple React-based URL shortener that allows users to input a URL and generate a shortened version using hashing. It also provides functionality to expand a shortened URL back to its original form.

## Features
- Shorten long URLs into short, hash-based URLs
- Expand shortened URLs back to their original form
- Simple and clean UI with a serene background

## Technologies Used
- React (with Vite for fast development)
- CryptoJS for URL hashing
- CSS for styling and background image

## Prerequisites
Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm (comes with Node.js) or yarn

## Installation and Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```
   This will start the app at `http://localhost:5173/` (default Vite port).

## Deployment
To build the project for production:
```sh
npm run build
```
This will generate optimized static files inside the `dist/` directory.

To preview the built app locally:
```sh
npm run preview
```

## Customization
- To change the background image, update `URLShortener.css` in the `.background-image` class with a new image URL.
- To modify URL hashing behavior, edit `shortenUrl` in `App.jsx`.

## Troubleshooting
- If you encounter dependency issues, try deleting `node_modules` and `package-lock.json`:
  ```sh
  rm -rf node_modules package-lock.json
  npm install
  ```
  *(On Windows, use `rd /s /q node_modules` and `del package-lock.json` instead of `rm`.)*

## License
MIT License. Feel free to modify and use it as needed.