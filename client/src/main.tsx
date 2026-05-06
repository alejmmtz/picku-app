import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CartProvider } from "./providers/CartProvider";
import "./index.css";

import router from "./routes/Router";
import { AxiosProvider } from "./providers/AxiosProvider";

createRoot(document.getElementById("root")!).render(
  <AxiosProvider>
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
  </AxiosProvider>
);