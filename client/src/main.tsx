import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CartProvider } from "./providers/CartProvider";
import "./index.css";
import "leaflet/dist/leaflet.css";

import router from "./routes/Router";
import { AxiosProvider } from "./providers/AxiosProvider";
import { StrictMode } from "react";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AxiosProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AxiosProvider>
  </StrictMode>
);
