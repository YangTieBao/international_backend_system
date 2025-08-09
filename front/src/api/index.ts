import { http } from '@/utils';

export const commonsRequests = () => {
    //是否返回的是加密结果
    const isEncryptResponse = false

    //从后端获取指定语言的翻译数据
    const fetchLanguage = (language: string, isLogin: boolean = false) => {
        return http({
            url: '/commons/languages',
            method: 'post',
            data: { language, isLogin },
            isEncryptResponse
        });

    };

    return { fetchLanguage }

}