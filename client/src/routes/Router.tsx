import { createBrowserRouter } from "react-router-dom";
import ConsumerOrder from "../pages/consumer/order/Order";
import EntrepreneurOrder from "../pages/entrepreneur/order/Order";
import RoleSelector from "../pages/role-selector/RoleSelector";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RoleSelector,
  },
  {
    // temporal mientras llega login
    path: "/consumer/login",
    element: <div>Customer Login</div>,
  },
  {
    path: "/consumer/order",
    Component: ConsumerOrder,
  },
  {
    //temporal pq no existe la pantalla
    path: "/entrepreneur/login",
    element: <div>Entrepreneur Login</div>,
  },
  {
    path: "/entrepreneur/order",
    Component: EntrepreneurOrder,
  },
]);

export default router;
