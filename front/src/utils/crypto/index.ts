import CryptoJS from 'crypto-js';
import { publicKey } from './publicKey';

const ENCRYPT_LOGIN_KEY = import.meta.env.VITE_LOGIN_CRYPTO;

export const encrypt_decrypt = () => {
    const { KEY_STORAGE_NAME, generateAndStoreKey, getEncryptedKeyMaterial, getKeyMaterial } = publicKey();

    // AES加密：明文 -> 密文
    const encrypt = async (
        data?: object | string | null
    ): Promise<{
        encryptedData?: string;
        encryptedKey: string;
        iv: string;
        hashAlgorithm: string;
    }> => {
        // 确保密钥存在
        if (!sessionStorage.getItem(KEY_STORAGE_NAME)) {
            await generateAndStoreKey();
        }

        const hashAlgorithm = 'SHA-256';
        const { encryptedKey, iv: ivStr } = await getEncryptedKeyMaterial();

        // 如果未提供数据，直接返回加密参数
        if (!data) {
            return {
                encryptedKey,
                iv: ivStr,
                hashAlgorithm,
            };
        }

        // 处理并加密数据
        const plainText = typeof data === 'object'
            ? JSON.stringify(data)
            : data;

        const { key, iv } = getKeyMaterial();
        const encrypted = CryptoJS.AES.encrypt(plainText, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return {
            encryptedData: encrypted.toString(),
            encryptedKey,
            iv: ivStr,
            hashAlgorithm,
        };
    }

    //本地AES解密
    const decrypt = (ciphertext: string): string => {
        try {
            const { key, iv } = getKeyMaterial();

            const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            throw new Error('数据解密失败');
        }
    }

    // 加密登录密码函数
    const loginEncrypt = (data: string): string => {
        return CryptoJS.AES.encrypt(data, ENCRYPT_LOGIN_KEY).toString();
    };

    // 解密登录密码函数
    const loginDecrypt = (encryptedData: string): string => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPT_LOGIN_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    return { encrypt, decrypt, loginEncrypt, loginDecrypt }
}
