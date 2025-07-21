import * as React from "react";

export interface RouteItem {
    index?: boolean;
    path?: string;
    name?: string;
    element: React.ReactNode;
    children?: RouteItem[];
    meta?: {
        isAuth?: boolean;
        title?: string;
        roles?: string[];
    };
}