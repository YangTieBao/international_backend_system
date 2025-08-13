import { lazy } from "react";
import { Navigate } from 'react-router-dom';
import * as RouterTypes from "@/router/types";

const Setting = lazy(() => import("@mod/views/Setting"));
const NotFound = lazy(() => import("@mod/views/NotFound"));
const EnterLoading = lazy(() => import("@mod/views/NotFound"));

// 这里设置路由不能有 ‘ / ’,因为使用的是相对路径
export const moduleRoutes: RouterTypes.RouteItem[] = [
    {
        path: "setting", // 相对于 /dashboard/setting
        name: 'setting',
        element: <Setting />,
        meta: { title: "配置中心" }
    }
]
