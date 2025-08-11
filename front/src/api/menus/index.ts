import { http } from '@/utils';

export const menusRequests = () => {
    //是否返回的是加密结果
    const isEncryptResponse = false

    const getMenus = (data: object) => {
        return http({
            url: '/menus/getMenus',
            method: 'post',
            data,
            isEncryptResponse
        });
    }

    return { getMenus }
}