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
        path: '/dashboard/home'
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
            const newItemId = action.payload.id;
            const exists = state.topMenus.some(item => item.id === newItemId);
            if (!exists) {
                state.topMenus.push(action.payload);
            }
        },
        filterTopMenus: (state, action) => {
            state.topMenus = state.topMenus.filter(
                (item) => item.id !== action.payload
            );
        }
    }
});

export default menuSlice;
