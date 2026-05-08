import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import MyOrders from "../pages/consumer/orders/MyOrders";
import OrderDetails from "../pages/consumer/orders/OrderDetails";

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
    path: "/consumer/orders",
    Component: MyOrders,
  },
  {
    path: "/consumer/orders/:id",
    Component: OrderDetails,
  },
  {
    //temporal pq no existe la pantalla
    path: "/entrepreneur/login",
    element: <div>Entrepreneur Login</div>,
  },
]);

export default router;
