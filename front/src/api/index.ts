import axios from 'axios'; // 假设使用 axios 发请求

// 从后端获取指定语言的翻译数据
export const fetchLocaleData = async (lang: string) => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_URL_HEAD + `/locales/${lang}`);
        return response.data.data;
    } catch (error) {
        console.error(`获取 ${lang} 语言数据失败`, error);
        const fallbackResponse = await axios.get(import.meta.env.VITE_API_URL_HEAD + '/locales/zh');
        return fallbackResponse.data.data;
    }
};

import request from '../utils/axios';

// 登录请求参数类型
interface LoginParams {
    username: string;
    password: string;
}

// 登录响应数据类型
interface LoginResponse {
    token: string;
    userInfo: {
        id: number;
        name: string;
        role: string;
    };
}

/**
 * 登录接口（加密请求和响应）
 */
export function login(data: LoginParams) {
    return request<LoginResponse>({
        url: '/user/login',
        method: 'post',
        data,
        encrypt: true//启用加密请求
    });
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
    return request({
        url: '/user/info',
        method: 'get',
        encrypt: true//启用加密请求
    });
}


/**
 * 测试post无传递的数据
 * 
 */
export const queryMyData = () => {
    return request({
        url: '/user/queryMyData',
        method: 'post',
        encrypt: true//启用加密请求
    });
}

/**
 * 测试get有参数加密
 */
export function getUsernfo2(params: object) {
    return request({
        url: '/user/info2',
        method: 'get',
        encrypt: true,//启用加密请求
        params
    });
}