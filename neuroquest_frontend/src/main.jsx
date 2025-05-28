import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";

// PUBLIC_INTERFACE
const rootElement = document.getElementById("app");
ReactDOM.createRoot(rootElement).render(<App />);
