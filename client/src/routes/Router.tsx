import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import EntrepreneurLogin from "../pages/entrepreneur-auth/EntrepreneurLogin";
import EntrepreneurSignup from "../pages/entrepreneur-auth/EntrepreneurSignup";
import EntrepreneurProfile from "../pages/entrepreneur/profile/EntrepreneurProfile";

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
  {
    path: "/entrepreneur/profile",
    Component: EntrepreneurProfile,
  },
  {
    path: "/entrepreneur/onboarding/category",
    element: <div className="flex min-h-screen items-center justify-center bg-background px-8 text-center font-sofia text-maroon">Entrepreneur onboarding category</div>,
  },
]);

export default router;
