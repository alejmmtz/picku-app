import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CartProvider } from "./providers/CartProvider";
import "./index.css";

import router from "./routes/Router";
import { AxiosProvider } from "./providers/AxiosProvider";
import { MapsProvider } from "./providers/MapsProvider";
import { OrdersRealtimeProvider } from "./providers/OrdersRealtimeProvider";
import { StrictMode } from "react";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AxiosProvider>
      <OrdersRealtimeProvider>
        <MapsProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </MapsProvider>
      </OrdersRealtimeProvider>
    </AxiosProvider>
  </StrictMode>
);
