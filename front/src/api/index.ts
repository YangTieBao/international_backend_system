import http from '../utils/axios/index';

export const commonsRequests = () => {
    const PUBLIC_KEY_STORAGE = "__APP_PUBLIC_KEY__";

    // 获取后端公钥（带缓存和格式清洗）
    async function getPublicKey(): Promise<string> {
        const cachedKey = sessionStorage.getItem(PUBLIC_KEY_STORAGE);
        if (cachedKey) {
            return cleanPublicKey(cachedKey);
        }
        try {
            const response = await fetch('/commons/getPublicKey');
            if (!response.ok) throw new Error('公钥获取失败');

            const publicKey = await response.text();
            const cleanedKey = cleanPublicKey(publicKey);
            sessionStorage.setItem(PUBLIC_KEY_STORAGE, cleanedKey);
            return cleanedKey;
        } catch (error) {
            throw new Error('无法获取加密公钥');
        }
    }

    //从后端获取指定语言的翻译数据
    const fetchLanguage = async (language: string) => {
        try {
            return http({
                url: '/commons/languages',
                method: 'post',
                data: { language },
                encrypt: true//启用加密请求
            });
        } catch (error) {
            return http({
                url: '/commons/languages',
                method: 'post',
                data: { language: 'zh' },
                encrypt: true//启用加密请求
            });
        }
    };

    return { getPublicKey, fetchLanguage }

}

//清洗公钥格式（移除标记和空白）
const cleanPublicKey = (publicKey: string): string => {
    return publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s+/g, '');
}