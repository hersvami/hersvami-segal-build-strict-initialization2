import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { clearBrowserRuntimeCaches } from "./utils/cacheControl";

void clearBrowserRuntimeCaches();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
