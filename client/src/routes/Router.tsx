import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import EntrepreneurLogin from "../pages/entrepreneur-auth/EntrepreneurLogin";
import EntrepreneurSignup from "../pages/entrepreneur-auth/EntrepreneurSignup";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RoleSelector,
  },
  {
    //temporal pq no existe la pantalla
    path: "/consumer/login",
    element: <div>Consumer Login</div>,
  },
  {
    path: "/entrepreneur/login",
    Component: EntrepreneurLogin,
  },
  {
    path: "/entrepreneur/signup",
    Component: EntrepreneurSignup,
  },
  {
    path: "/entrepreneur/home",
    element: <div className="flex min-h-screen items-center justify-center bg-background font-sofia text-maroon">Entrepreneur Home</div>,
  },
]);

export default router;
