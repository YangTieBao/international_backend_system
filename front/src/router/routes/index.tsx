import { lazy } from "react";
import { Navigate } from 'react-router-dom';
import Login from '../../views/Login';
import * as RouterTypes from "../types";

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
        path: "/dashboard",
        name: 'dashboard',
        element: <Dashboard />,
        children: [

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