import React from "react";
import { createRoot } from "react-dom/client";
import "./storage.js";
import "./index.css";
import AzadAgroStore from "./AzadAgroStore.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AzadAgroStore />
  </React.StrictMode>
);
