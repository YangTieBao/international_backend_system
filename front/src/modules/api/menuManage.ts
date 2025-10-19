import { http } from '@/utils';

export const menuManageRequests = () => {
    const isEncryptResponse = false
    // 保存
    const save = (formData: any) => {
        return http({
            url: '/menus/save',
            method: 'post',
            data: { formData },
            isEncryptResponse
        });

    };

    // 删除
    const del = (id: string | number) => {
        return http({
            url: '/menus/delete',
            method: 'post',
            data: { id },
            isEncryptResponse
        });
    }

    // 获取父菜单
    const getParentMenus = (grade: number) => {
        return http({
            url: '/menus/getParentMenus',
            method: 'post',
            data: { grade },
            isEncryptResponse
        });
    }

    return { save, del, getParentMenus }
}