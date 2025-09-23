import { http } from '@/utils';

export const menuManageRequests = () => {
    const isEncryptResponse = false
    // 保存
    const save = (formData: any) => {
        return http({
            url: '/commons/save',
            method: 'post',
            data: { formData },
            isEncryptResponse
        });

    };

    // 删除
    const del = (id: string) => {
        return http({
            url: '/commons/delete',
            method: 'post',
            data: { id },
            isEncryptResponse
        });
    }

    return { save, del }
}