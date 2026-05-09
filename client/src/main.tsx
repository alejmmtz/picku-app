import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { AxiosProvider } from "./config/axiosConfig";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AxiosProvider>
      <RouterProvider router={router} />
    </AxiosProvider>
  </StrictMode>
);
