import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ModalButtonProvider } from "./hooks/ModalContrext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ModalButtonProvider>
      <App />
    </ModalButtonProvider>
  </React.StrictMode>
);
