import { http } from '@/utils';

//是否返回的是加密结果
const isEncryptResponse = false

export const commonsRequests = () => {

    //从后端获取指定语言的翻译数据
    const fetchLanguage = (language: string, isLogin: boolean = false) => {
        return http({
            url: '/commons/languages',
            method: 'post',
            data: { language, isLogin },
            isEncryptResponse
        });

    };

    const fetchTableData = (url: string, method: string = 'post', params: object) => {
        return http({
            url: url,
            method: method,
            data: params,
            isEncryptResponse
        });
    }

    return { fetchLanguage, fetchTableData }

}

export const tableRequests = () => {
    const fetchTableData = (url: string, method: string = 'post', params: object) => {
        return http({
            url: url,
            method: method,
            data: params,
            isEncryptResponse
        });
    }

    return { fetchTableData }
}