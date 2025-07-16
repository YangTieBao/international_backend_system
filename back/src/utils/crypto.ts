import crypto from 'crypto';
import CryptoJS from 'crypto-js';

export const encrypt_decrypt = () => {
    interface EncryptedRequest {
        encryptedData?: string;
        encryptedKey: string;
        iv: string;
        hashAlgorithm: string;
    }

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

    // 提供公钥
    const getPublicKey = (): string => {
        return publicKey;
    }

    /**
     * 使用私钥解密对称密钥
     * @param encryptedKey Base64 编码的加密密钥
     * @param hashAlgorithm 哈希算法名称
     * @returns 解密后的对称密钥（Hex 字符串）
     */
    const decryptSymmetricKey = (encryptedKey: string, hashAlgorithm: string): string => {
        try {
            const encryptedBuffer = Buffer.from(encryptedKey, 'base64');
            const decryptedBuffer = crypto.privateDecrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: hashAlgorithm
                },
                encryptedBuffer
            );
            return decryptedBuffer.toString('hex'); // 直接返回 Hex 字符串
        } catch (error) {
            console.error('解密对称密钥失败:', error);
            throw new Error('密钥解密失败');
        }
    }

    /**
     * 使用 AES 解密数据
     * @param encryptedData 加密的数据
     * @param keyHex 对称密钥（Hex 字符串）
     * @param ivHex IV（Hex 字符串）
     * @returns 解密后的原始数据
     */
    const decryptData = (encryptedData: string, keyHex: string, ivHex: string): string => {
        try {
            const key = CryptoJS.enc.Hex.parse(keyHex);
            const iv = CryptoJS.enc.Hex.parse(ivHex);

            const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            throw new Error('数据解密失败');
        }
    }

    /**
     * 使用 AES 加密数据
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

            const encrypted = CryptoJS.AES.encrypt(plainText, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return encrypted.toString();
        } catch (error) {
            throw new Error('数据加密失败');
        }
    }

    /**
     * 处理 POST 加密请求
     */
    const handlePostEncryptedRequest = (requestBody: EncryptedRequest): { symmetricKey: string; jsonDecryptedData: any } => {
        try {
            const { encryptedData, encryptedKey, iv, hashAlgorithm } = requestBody;

            // 解密对称密钥
            const symmetricKey = decryptSymmetricKey(encryptedKey, hashAlgorithm);

            let jsonDecryptedData: any;
            if (encryptedData) {
                // 解密请求数据
                const decryptedData = decryptData(encryptedData, symmetricKey, iv);
                // 尝试解析为 JSON
                try {
                    jsonDecryptedData = JSON.parse(decryptedData);
                } catch {
                    throw new Error('不是 JSON 数据');
                }
            } else {
                jsonDecryptedData = {};
            }

            return { symmetricKey, jsonDecryptedData };
        } catch (error) {
            throw new Error('无法处理 POST 加密请求');
        }
    }

    /**
     * 处理 GET 加密请求
     */
    const handleGetEncryptedRequest = (requestParams: EncryptedRequest): { symmetricKey: string; jsonDecryptedData: any } => {
        try {
            const { encryptedData, encryptedKey, iv, hashAlgorithm } = requestParams;

            // 解密对称密钥
            const symmetricKey = decryptSymmetricKey(encryptedKey, hashAlgorithm);

            let jsonDecryptedData: any;
            if (encryptedData && encryptedData !== "0") {
                // 解密请求数据
                const decryptedData = decryptData(encryptedData, symmetricKey, iv);
                // 尝试解析为 JSON
                try {
                    jsonDecryptedData = JSON.parse(decryptedData);
                } catch {
                    throw new Error('不是 JSON 数据');
                }
            } else {
                jsonDecryptedData = {};
            }

            return { symmetricKey, jsonDecryptedData };
        } catch (error) {
            throw new Error('无法处理 GET 加密请求');
        }
    }

    /**
     * 准备加密响应
     * @param data 要响应的数据
     * @param symmetricKey 对称密钥（Hex 字符串）
     * @param requestIv 请求中的 IV（Hex 字符串）
     * @returns 加密后的响应体
     */
    const prepareEncryptedResponse = (data: string | object, symmetricKey: string, requestIv: string): { encryptedData: string } => {
        try {
            const encryptedData = encryptData(data, symmetricKey, requestIv);
            return { encryptedData };
        } catch (error) {
            throw new Error('无法加密响应数据');
        }
    }

    return { getPublicKey, handleGetEncryptedRequest, handlePostEncryptedRequest, prepareEncryptedResponse }
}
