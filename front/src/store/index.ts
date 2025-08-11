import { configureStore } from '@reduxjs/toolkit';
import commonSlice from './slices/commons';
import menuSlice from './slices/menus';
import userSlice from './slices/users';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        common: commonSlice.reducer,
        menu: menuSlice.reducer
    },
});

export const { loginSuccess } = userSlice.actions;
export const { changeCollapsed } = commonSlice.actions;
export const { getMenusState } = menuSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;