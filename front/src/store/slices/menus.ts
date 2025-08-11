import { createSlice } from '@reduxjs/toolkit';

interface Menus {
    menus: any;
}

const initialState: Menus = {
    menus: []
};

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        getMenusState: (state, action) => {
            state.menus = action.payload.menus;
        },
    },
});

export default menuSlice;
