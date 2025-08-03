import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface UserInfo {
    user_id?: number;
    name?: string;
    username?: string;
    sex?: string;
    age?: number;
    role_id?: number;
    role_type?: string;
    role_description?: string;
    defaultLanguage?: string;
}

interface UserMenus {
    user_id: number;
    name: string;
    username: string;
    sex: string;
    age?: number;
    role_id: number;
    role_type: string;
    role_description?: string;
    defaultLanguage?: string;
}

interface UserState {
    userInfo: UserInfo;
    userMenus: any[];
}

interface LoginSuccessPayload {
    userInfo: UserInfo;
    userMenus: any[];
}

let storeUserInfo: Partial<UserState> = {};

try {
    const jsonStoreUserInfo = sessionStorage.getItem('userInfos');
    if (jsonStoreUserInfo) {
        storeUserInfo = JSON.parse(jsonStoreUserInfo);
    }
} catch (error) {
    sessionStorage.removeItem('userInfos');
}

const initialState: UserState = {
    userInfo: storeUserInfo.userInfo ?? {},
    userMenus: storeUserInfo.userMenus ?? []
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
            // 从 action.payload 中获取用户信息并更新状态
            state.userInfo = action.payload.userInfo;
            state.userMenus = action.payload.userMenus;
            sessionStorage.setItem('userInfos', JSON.stringify(action.payload))
            if (action.payload.userInfo.defaultLanguage) {
                localStorage.setItem('language', action.payload.userInfo.defaultLanguage)
            }
        },
    },
});

export default userSlice;
