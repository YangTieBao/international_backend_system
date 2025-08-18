import * as RouterTypes from "@/router/types";
import { lazy } from "react";

const Setting = lazy(() => import("@mod/views/Setting"));
const MenuManage = lazy(() => import("@mod/views/MenuManage"));
const WordManage = lazy(() => import("@mod/views/WordManage"));
const NotFound = lazy(() => import("@/views/NotFound"));
const EnterLoading = lazy(() => import("@/views/NotFound"));

// 这里设置路由不能有 ‘ / ’,因为使用的是相对路径
export const moduleRoutes: RouterTypes.RouteItem[] = [
    {
        path: "menuManage", // 相对于 /dashboard/menuManage
        name: 'menuManage',
        element: <MenuManage />,
        meta: { title: "菜单管理" }
    },
    {
        path: "wordManage",
        name: 'wordManage',
        element: <WordManage />,
        meta: { title: "词条管理" }
    }
]
