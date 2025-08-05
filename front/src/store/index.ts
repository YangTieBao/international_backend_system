import { configureStore } from '@reduxjs/toolkit';
import commonSlice from './slices/commons';
import userSlice from './slices/users';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        common: commonSlice.reducer
    },
});

export const { loginSuccess } = userSlice.actions;
export const { changeCollapsed } = commonSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;