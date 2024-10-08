import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";
import { Toaster } from "sonner";
import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster
      duration={1100}
      position="top-center"
      theme="dark"
      closeButton
      richColors
    />
    <App />
  </React.StrictMode>
);
