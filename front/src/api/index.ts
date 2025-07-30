import { http } from '@/utils';

export const commonsRequests = () => {
    //是否返回的是加密结果
    const isEncryptResponse = true

    //从后端获取指定语言的翻译数据
    const fetchLanguage = (language: string) => {
        try {
            return http({
                url: '/commons/languages',
                method: 'post',
                data: { language },
                isEncryptResponse
            });
        } catch (error) {
            return http({
                url: '/commons/languages',
                method: 'post',
                data: { language: 'zh' }
            });
        }
    };

    return { fetchLanguage }

}