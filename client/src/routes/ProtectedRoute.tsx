import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  getDefaultRouteForRole,
  getStoredAuth,
  getStoredRole,
  isStoredSessionValid,
  removeStoredAuth,
  type StoredUserRole,
} from "../utils/storage";

type ProtectedRouteProps = {
  redirectTo: string;
  allowedRoles?: StoredUserRole[];
};

const ProtectedRoute = ({
  redirectTo,
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const auth = getStoredAuth();

  if (!isStoredSessionValid(auth)) {
    removeStoredAuth();

    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  const role = getStoredRole();

  if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
