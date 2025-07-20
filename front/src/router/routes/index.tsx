import { lazy } from "react";
import { Navigate } from 'react-router-dom';
import AuthGuard from "../guard";
import * as RouterTypes from "../types";

const Login = lazy(() => import("../../views/Login"));
const Dashboard = lazy(() => import("../../views/Dashboard"));
const NotFound = lazy(() => import("../../views/NotFound"));

const routes: RouterTypes.RouteItem[] = [
    {
        path: "/login",
        name: 'login',
        element: <Login />,
        meta: { title: "登录" }
    },
    {
        path: "/a",
        element: (
            <AuthGuard route={{ path: "/", element: <Dashboard />, meta: { isAuth: true } }}>
                <Dashboard />
            </AuthGuard>
        ),
        meta: {
            isAuth: true,
            title: "控制台"
        }
    },
    {
        path: '/',
        element: <Navigate to='/login' replace />
    },
    {
        path: "*",
        element: <NotFound />,
        meta: { title: "404" }
    }
];

export default routes;