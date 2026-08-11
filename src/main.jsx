import React from "react";
import { ClerkProvider } from "@clerk/react";
import { createRoot } from "react-dom/client";
import "./storage.js";
import "./index.css";
import AzadAgroStore from "./AzadAgroStore.jsx";
import { getClerkPublishableKey, isClerkConfigured } from "./auth/clerkConfig.js";

const publishableKey = getClerkPublishableKey();
const clerkEnabled = isClerkConfigured();

const clerkAppearance = {
  variables: {
    colorPrimary: "#B7C98A",
    colorBackground: "#1C2A22",
    colorInputBackground: "#243028",
    colorInputText: "#F3EEE4",
    colorText: "#F3EEE4",
    colorTextSecondary: "#C9D2C4",
    borderRadius: "0.75rem",
  },
};

const app = <AzadAgroStore clerkEnabled={clerkEnabled} />;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {clerkEnabled ? (
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/" appearance={clerkAppearance}>
        {app}
      </ClerkProvider>
    ) : (
      app
    )}
  </React.StrictMode>
);
