import Login from '@/views/Login';
import { lazy } from "react";
import { Navigate } from 'react-router-dom';
import * as RouterTypes from "../types";

const Dashboard = lazy(() => import("@/views/Dashboard"));
const NotFound = lazy(() => import("@/views/NotFound"));
const Home = lazy(() => import("@/views/Dashboard/home"));

const routes: RouterTypes.RouteItem[] = [
    {
        path: "/login",
        name: 'login',
        element: <Login />,
        meta: { title: "登录" }
    },
    {
        path: "/dashboard",
        name: 'dashboard',
        element: <Dashboard />,
        children: [
            {
                path: "/dashboard/home",
                name: 'home',
                element: <Home />,
            },
            {
                index: true,
                element: <Navigate to='/dashboard/home' />
            }
        ]
    },
    {
        index: true,
        element: <Navigate to='/login' replace />
    },
    {
        path: "*",
        element: <NotFound />,
        meta: { title: "404" }
    }
];

export default routes;