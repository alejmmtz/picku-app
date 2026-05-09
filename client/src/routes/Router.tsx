import { createBrowserRouter } from "react-router-dom";
import RoleSelector from "../pages/role-selector/RoleSelector";
import EntrepreneurOnboardingIntro from "../pages/entrepreneur/onboarding/EntrepreneurOnboardingIntro";
import EntrepreneurCategory from "../pages/entrepreneur/onboarding/EntrepreneurCategory";
import EntrepreneurBusinessInfo from "../pages/entrepreneur/onboarding/EntrepreneurBusinessInfo";
import EntrepreneurImage from "../pages/entrepreneur/onboarding/EntrepreneurImage";
import EntrepreneurConfirm from "../pages/entrepreneur/onboarding/EntrepreneurConfirm";
import EntrepreneurSuccess from "../pages/entrepreneur/onboarding/EntrepreneurSuccess";
import EntrepreneurHome from "../pages/entrepreneur/home/EntrepreneurHome";

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
    path: "/entrepreneur/home",
    Component: EntrepreneurHome,
  },
]);

export default router;
