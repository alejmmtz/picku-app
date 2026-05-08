import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { AxiosProvider } from "./providers/AxiosProvider";


createRoot(document.getElementById("root")!).render(
<AxiosProvider>
  <RouterProvider router={router} />
</AxiosProvider>
);