import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as RouterTypes from "../types";

interface AuthGuardProps {
  route: RouterTypes.RouteItem;
  children: React.ReactNode;
}

const AuthGuard = ({ route, children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检查是否需要认证
    if (route.meta?.isAuth) {
      const isAuthenticated = !!sessionStorage.getItem("token");

      if (!isAuthenticated) {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname }
        });
      }
    }

    // 设置页面标题
    if (route.meta?.title) {
      document.title = `${route.meta.title} | My App`;
    }
  }, [route, navigate, location]);

  return <>{children}</>;
};

export default AuthGuard;