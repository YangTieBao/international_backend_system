import crypto from 'crypto';
import CryptoJS from 'crypto-js';

// 生成 RSA 密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

export const encrypt_decrypt = () => {
    interface EncryptedRequest {
        encryptedData?: string;
        encryptedKey: string;
        iv: string;
        hashAlgorithm: string;
    }

    // 提供公钥
    const getPublicKey = (): string => publicKey;

    /**
     * 解密对称密钥
     * @param encryptedKey Base64 编码的加密密钥
     * @param hashAlgorithm 哈希算法名称
     * @returns 解密后的对称密钥（Hex 字符串）
     */
    const decryptSymmetricKey = (encryptedKey: string, hashAlgorithm: string): string => {
        try {
            const encryptedArray = new Uint8Array(Buffer.from(encryptedKey, 'base64'));

            const decryptedBuffer = crypto.privateDecrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: hashAlgorithm
                },
                encryptedArray
            );
            const utf8String = Buffer.from(decryptedBuffer.toString('hex'), 'hex').toString('utf-8');
            return utf8String;
        } catch (error) {
            console.log(error)
            throw new Error('对称解密失败');
        }
    }

    /**
    * 解密数据并解析为JSON
    * @param encryptedData 加密的数据（支持"0"作为空值标识）
    * @param keyHex 对称密钥（Hex 字符串）
    * @param ivHex IV（Hex 字符串）
    * @param isGetRequest 是否为GET请求
    * @returns 解密后的JSON数据
    */
    const decryptAndParseData = (
        encryptedData?: string,
        keyHex?: string,
        ivHex?: string
    ): any => {
        const isEmptyData = encryptedData == '0' || !encryptedData;
        if (isEmptyData) {
            return {};
        }

        if (!keyHex || !ivHex) {
            throw new Error('缺少对称密钥');
        }

        try {
            const key = CryptoJS.enc.Hex.parse(keyHex);
            const iv = CryptoJS.enc.Hex.parse(ivHex);
            const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
            return decryptedText ? JSON.parse(decryptedText) : {};
        } catch (error) {
            throw new Error('数据解密失败');
        }
    }

    /**
     * 加密数据
     * @param data 要加密的数据（字符串或对象）
     * @param keyHex 对称密钥（Hex 字符串）
     * @param ivHex IV（Hex 字符串）
     * @returns 加密后的数据
     */
    const encryptData = (data: string | object, keyHex: string, ivHex: string): string => {
        try {
            const plainText = typeof data === 'object'
                ? JSON.stringify(data)
                : data;

            const key = CryptoJS.enc.Hex.parse(keyHex);
            const iv = CryptoJS.enc.Hex.parse(ivHex);

            return CryptoJS.AES.encrypt(plainText, key, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString();
        } catch (error) {
            throw new Error('数据加密失败');
        }
    }

    /**
     * 处理加密请求
     * @param requestData 加密的请求数据
     * @param isGetRequest 是否为GET请求（默认false）
     * @returns 解密后的对称密钥和数据
     */
    const handleEncryptedRequest = (
        requestData: EncryptedRequest
    ): { symmetricKey: string; jsonDecryptedData: any } => {
        try {
            const { encryptedData, encryptedKey, iv, hashAlgorithm } = requestData;

            // 解密对称密钥
            const symmetricKey = decryptSymmetricKey(encryptedKey, hashAlgorithm);

            // 解密并解析请求数据
            const jsonDecryptedData = decryptAndParseData(
                encryptedData,
                symmetricKey,
                iv
            );

            return { symmetricKey, jsonDecryptedData };
        } catch (error) {
            throw new Error(`处理加密请求失败`);
        }
    }

    /**
     * 准备加密响应
     * @param data 要响应的数据
     * @param symmetricKey 对称密钥（Hex 字符串）
     * @param requestIv 请求中的 IV（Hex 字符串）
     * @returns 加密后的响应体
     */
    const prepareEncryptedResponse = (
        data: string | object,
        symmetricKey: string,
        requestIv: string
    ): String => {
        try {
            const encryptedData = encryptData(data, symmetricKey, requestIv)
            return encryptedData
        } catch (error) {
            throw new Error('加密响应数据失败');
        }
    }

    return {
        getPublicKey,
        handleEncryptedRequest,
        prepareEncryptedResponse
    }
}
