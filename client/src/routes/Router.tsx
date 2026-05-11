import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import ConsumerLogin from "../pages/consumer-auth/ConsumerLogin";
import ConsumerSignup from "../pages/consumer-auth/ConsumerSignup";
import MyOrders from "../pages/consumer/orders/MyOrders";
import OrderDetails from "../pages/consumer/orders/OrderDetails";
import EntrepreneurLogin from "../pages/entrepreneur-auth/EntrepreneurLogin";
import EntrepreneurSignup from "../pages/entrepreneur-auth/EntrepreneurSignup";
import EntrepreneurOnboardingIntro from "../pages/entrepreneur/onboarding/EntrepreneurOnboardingIntro";
import EntrepreneurCategory from "../pages/entrepreneur/onboarding/EntrepreneurCategory";
import EntrepreneurBusinessInfo from "../pages/entrepreneur/onboarding/EntrepreneurBusinessInfo";
import EntrepreneurImage from "../pages/entrepreneur/onboarding/EntrepreneurImage";
import EntrepreneurConfirm from "../pages/entrepreneur/onboarding/EntrepreneurConfirm";
import EntrepreneurSuccess from "../pages/entrepreneur/onboarding/EntrepreneurSuccess";
import EntrepreneurHome from "../pages/entrepreneur/home/EntrepreneurHome";

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
    path: "/consumer/orders",
    Component: MyOrders,
  },
  {
    path: "/consumer/orders/:id",
    Component: OrderDetails,
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
    Component: EntrepreneurHome,
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
  {
    path: "/entrepreneur/onboarding",
    Component: EntrepreneurOnboardingIntro,
  },
  {
    path: "/entrepreneur/onboarding/category",
    Component: EntrepreneurCategory,
  },
  {
    path: "/entrepreneur/onboarding/business",
    Component: EntrepreneurBusinessInfo,
  },
  {
    path: "/entrepreneur/onboarding/image",
    Component: EntrepreneurImage,
  },
  {
    path: "/entrepreneur/onboarding/confirm",
    Component: EntrepreneurConfirm,
  },
  {
    path: "/entrepreneur/onboarding/success",
    Component: EntrepreneurSuccess,
  },
]);

export default router;