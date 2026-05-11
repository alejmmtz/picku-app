import { createBrowserRouter } from "react-router-dom";
import ConsumerOrder from "../pages/consumer/order/Order";
import ConsumerOrderReceipt from "../pages/consumer/order-receipt/OrderReceipt";
import EntrepreneurOrder from "../pages/entrepreneur/order/Order";
import EntrepreneurOrderReceipt from "../pages/entrepreneur/order-receipt/OrderReceipt";
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

import Chatbot from "../pages/consumer/chatbot/Chatbot";
import ConsumerProfile from "../pages/consumer/profile/ConsumerProfile";
import EntrepreneurProfile from "../pages/entrepreneur/profile/EntrepreneurProfile";
import ProtectedRoute from "./ProtectedRoute";
import ConsumerHome from "../pages/consumer/home/ConsumerHome";
import BusinessDetail from "../pages/consumer/home/BusinessDetail";
import ProductDetail from "../pages/consumer/home/ProductDetail";
import Cart from "../pages/consumer/cart/Cart";
import Checkout from "../pages/consumer/checkout/Checkout";
import EntrepreneurProducts from "../pages/entrepreneur/products/EntrepreneurProducts";
import EditProduct from "../pages/entrepreneur/products/EditProduct";
import AddProduct from "../pages/entrepreneur/products/AddProduct";

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
    path: "/consumer/order",
    Component: ConsumerOrder,
  },
  {
    path: "/consumer/order-receipt",
    Component: ConsumerOrderReceipt,
  },
  {
    path: "/consumer/signup",
    Component: ConsumerSignup,
  },
  {
    element: (
      <ProtectedRoute
        redirectTo="/consumer/login"
        allowedRoles={["consumer"]}
      />
    ),
    children: [
      {
        path: "/consumer/orders",
        Component: MyOrders,
      },
      {
        path: "/consumer/orders/:id",
        Component: OrderDetails,
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
        path: "/consumer/chatbot",
        Component: Chatbot,
      },
      {
        path: "/consumer/profile",
        Component: ConsumerProfile,
      },
    ],
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
    element: (
      <ProtectedRoute
        redirectTo="/entrepreneur/login"
        allowedRoles={["entrepreneur"]}
      />
    ),
    children: [
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
      {
        path: "/entrepreneur/profile",
        Component: EntrepreneurProfile,
      },
    ],
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
