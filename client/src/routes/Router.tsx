import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import ConsumerLogin from "../pages/consumer-auth/ConsumerLogin";
import ConsumerSignup from "../pages/consumer-auth/ConsumerSignup";

import EntrepreneurProducts from "../pages/entrepreneur/EntrepreneurProducts";
import EditProduct from "../pages/entrepreneur/EditProduct";
import AddProduct from "../pages/entrepreneur/AddProduct";

import ConsumerHome from "../pages/consumer/ConsumerHome";
import BusinessDetail from "../pages/consumer/BusinessDetail";
import ProductDetail from "../pages/consumer/ProductDetail";
import Cart from "../pages/consumer/Cart";
import Checkout from "../pages/consumer/Checkout";

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
  {
    path: "/consumer/cart",
    Component: Cart,
  },
  {
    path: "/consumer/checkout",
    Component: Checkout,
  },
]);

export default router;