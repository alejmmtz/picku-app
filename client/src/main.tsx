import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CartProvider } from "./providers/CartProvider";
import "./index.css";

import router from "./routes/Router";
import { AxiosProvider } from "./providers/AxiosProvider";
import { MapsProvider } from "./providers/MapsProvider";
import { SocketProvider } from "./providers/SocketProvider";
import { StrictMode } from "react";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AxiosProvider>
      <SocketProvider>
        <MapsProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </MapsProvider>
      </SocketProvider>
    </AxiosProvider>
  </StrictMode>
);
