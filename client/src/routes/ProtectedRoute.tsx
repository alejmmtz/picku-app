import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredAuth } from "../utils/storage";

type UserRole = "consumer" | "entrepreneur";

type ProtectedRouteProps = {
  redirectTo: string;
  allowedRoles?: UserRole[];
};

const getStoredRole = (): string | undefined => {
  const metadata = getStoredAuth()?.user.user_metadata;
  return typeof metadata?.role === "string" ? metadata.role : undefined;
};

const ProtectedRoute = ({
  redirectTo,
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const auth = getStoredAuth();

  if (!auth?.session.access_token) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const role = getStoredRole();

  if (allowedRoles?.length && role && !allowedRoles.includes(role as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
