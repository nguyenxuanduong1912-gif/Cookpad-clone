import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import HistoryProvider from "./context/HistoryContext.jsx";
import UserProvider from "./context/UserContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="364351034553-l6rrag06e0irb4jn4ng6dorciq5cpemj.apps.googleusercontent.com">
  <HistoryProvider>
    <UserProvider>
      <App />
    </UserProvider>
    <Toaster position="top-right" />
  </HistoryProvider>
  </GoogleOAuthProvider>
);
