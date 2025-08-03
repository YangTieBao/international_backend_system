import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/users';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});

export const { loginSuccess } = userSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;