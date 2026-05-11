import { createBrowserRouter } from "react-router-dom";
import ConsumerOrder from "../pages/consumer/order/Order";
import ConsumerOrderReceipt from "../pages/consumer/order-receipt/OrderReceipt";
import EntrepreneurOrder from "../pages/entrepreneur/order/Order";
import EntrepreneurOrderReceipt from "../pages/entrepreneur/order-receipt/OrderReceipt";
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
    path: "/consumer/order-receipt",
    Component: ConsumerOrderReceipt,
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
  {
    path: "/entrepreneur/order-receipt",
    Component: EntrepreneurOrderReceipt,
  },
]);

export default router;
