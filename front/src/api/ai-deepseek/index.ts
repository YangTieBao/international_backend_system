import { http } from '@/utils';

export const deepseekRequests = () => {
    //是否返回的是加密结果
    const isEncryptResponse = false

    const aiDeepseekChat = (data: object) => {
        return http({
            url: '/ai-deepseek/chat',
            method: 'post',
            data,
            isEncryptResponse
        });
    }

    return { aiDeepseekChat }
}