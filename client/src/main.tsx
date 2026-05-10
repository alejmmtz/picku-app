import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import router from "./routes/Router";
import { AxiosProvider } from "./providers/AxiosProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AxiosProvider>
      <RouterProvider router={router} />
    </AxiosProvider>
  </StrictMode>
);