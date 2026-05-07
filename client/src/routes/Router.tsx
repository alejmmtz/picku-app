import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import ConsumerLogin from "../pages/consumer-auth/ConsumerLogin";
import ConsumerSignup from "../pages/consumer-auth/ConsumerSignup";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RoleSelector,
  },
  {
    path: "/consumer/login",
    Component: ConsumerLogin,
  },
  {
    path: "/consumer/signup",
    Component: ConsumerSignup,
  },
  {
    //temporal pq no existe la pantalla
    path: "/entrepreneur/login",
    element: <div>Entrepreneur Login</div>,
  },
]);

export default router;
