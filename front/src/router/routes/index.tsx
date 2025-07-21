import { lazy } from "react";
import { Navigate } from 'react-router-dom';
import AuthGuard from "../guard";
import * as RouterTypes from "../types";

const Login = lazy(() => import("../../views/Login"));
const Dashboard = lazy(() => import("../../views/Dashboard"));
const NotFound = lazy(() => import("../../views/NotFound"));
const Index = lazy(() => import("../index"))

const routes: RouterTypes.RouteItem[] = [
    {
        path: "/login",
        name: 'login',
        element: <Login />,
        meta: { title: "登录" }
    },
    {
        path: "/index",
        name: 'index',
        element: <Index />,
        children: [
            {
                path: "/index/dashboard",
                name: 'dashboard',
                element: (
                    <AuthGuard route={{ path: "/index/dashboard", element: <Dashboard /> }}>
                        <Dashboard />
                    </AuthGuard>
                ),
                meta: {
                    title: "工作台"
                }
            },
            {
                path: '/index',
                element: <Navigate to='/index/dashboard' replace />
            }
        ]
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