import { http } from '../../utils';

export const usersRequests = () => {
    //是否返回的是加密结果
    const isEncryptResponse = false

    const login = (data: object) => {
        return http({
            url: '/users/login',
            method: 'post',
            data,
            isEncryptResponse
        });
    }

    return { login }
}