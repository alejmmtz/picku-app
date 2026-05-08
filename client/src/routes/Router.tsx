import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import EntrepreneurProducts from "../pages/entrepreneur/EntrepreneurProducts";
import EditProduct from "../pages/entrepreneur/EditProduct";
import AddProduct from "../pages/entrepreneur/AddProduct";


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
  path: "/entrepreneur/products",
  Component: EntrepreneurProducts,
  },
  {
    path: "/entrepreneur/products/edit/:id",
    Component: EditProduct,
  },
  {
    path: "/entrepreneur/products/new",
    Component: AddProduct,
  }
]);

export default router;
