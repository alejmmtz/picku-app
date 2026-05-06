import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import ConsumerHome from "../pages/consumer/ConsumerHome";
import BusinessDetail from "../pages/consumer/BusinessDetail";
import ProductDetail from "../pages/consumer/ProductDetail";

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
    //temporal pq no existe la pantalla
    path: "/entrepreneur/login",
    element: <div>Entrepreneur Login</div>,
  },

  {
    path: "/consumer/home",
    Component: ConsumerHome,
  },
  {
  path: "/consumer/business/:id",
  Component: BusinessDetail,
  },
  {
  path: "/consumer/product/:id",
  Component: ProductDetail, 
  },
]);

export default router;
