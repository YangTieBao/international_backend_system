import { messageFunctions } from '@/utils';
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as RouterTypes from "../types";

interface AuthGuardProps {
  route: RouterTypes.RouteItem;
  children: React.ReactNode;
}

const AuthGuard = ({ route, children }: AuthGuardProps) => {
  const { showWarning } = messageFunctions();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = Cookies.get('jwtToken');

    if (!isAuthenticated) {
      navigate("/login", {
        replace: true
      });
      showWarning('会话已过期，请重新登录！')
    }

    // 检查是否需要认证
    if (route.meta?.isAuth) {
    }

  }, [route, navigate, location]);

  return <>{children}</>;
};

export default AuthGuard;