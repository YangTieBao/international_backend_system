import { createSlice } from '@reduxjs/toolkit';

interface MenuItem {
    id?: number;
    parent_id?: number;
    title: string;
    path?: string;
    icon?: string;
    sort?: number;
    type?: number;
    is_visible?: number;
    isActived?: boolean;
}

interface Menus {
    menus: MenuItem[];
    topMenus: MenuItem[];
}

const initialState: Menus = {
    menus: [],
    topMenus: [{
        id: 1,
        title: '工作台',
        path: '/dashboard/home',
        isActived: true
    }]
};

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        getMenusState: (state, action) => {
            state.menus = action.payload.menus;
        },
        pushTopMenus: (state, action) => {
            const newItem = action.payload
            const newItemId = newItem.id;
            const exists = state.topMenus.some(item => item.id === newItemId);
            if (!exists) {
                state.topMenus.push(newItem);
                state.topMenus.forEach((item, index) => {
                    item.isActived = index === state.topMenus.length - 1;
                });
            } else {
                state.topMenus.forEach(item => {
                    item.isActived = item.id === newItemId;
                });
            }

        },
        filterTopMenus: (state, action) => {
            state.topMenus = state.topMenus.filter(
                (item) => item.id !== action.payload
            );
        },
        activeRoute: (state, action) => {
            const newItem = action.payload
            const newItemId = newItem.id;
            state.topMenus.forEach(item => {
                item.isActived = item.id === newItemId;
            });

        }
    }
});

export default menuSlice;
