import CryptoJS from 'crypto-js';

export const publicKey = () => {
    const KEY_STORAGE_NAME = "__APP_AES_KEY__";
    const PUBLIC_KEY_STORAGE = "__APP_PUBLIC_KEY__";

    //清洗公钥格式（移除标记和空白）
    const cleanPublicKey = (publicKey: string): string => {
        return publicKey
            .replace(/-----BEGIN PUBLIC KEY-----/g, '')
            .replace(/-----END PUBLIC KEY-----/g, '')
            .replace(/\s+/g, '');
    }

    // 获取后端公钥（带缓存和格式清洗）
    async function getPublicKey(): Promise<string> {
        const cachedKey = sessionStorage.getItem(PUBLIC_KEY_STORAGE);
        if (cachedKey) {
            return cleanPublicKey(cachedKey);
        }
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/base-api/commons/getPublicKey');
            const publicKey = await response.text();
            const publicKeyJson = JSON.parse(publicKey)
            const cleanedKey = cleanPublicKey(publicKeyJson.data.data.publicKey);
            sessionStorage.setItem(PUBLIC_KEY_STORAGE, cleanedKey);
            return cleanedKey;
        } catch (error) {
            throw new Error('公钥获取失败');
        }
    }
    interface RsaOaepParams extends Algorithm {
        name: "RSA-OAEP";
        hash: string | Algorithm;
        label?: ArrayBuffer;
    }

    //公钥加密
    const encryptWithPublicKey = async (data: string, publicKeyPem: string): Promise<string> => {
        const hashAlgorithm = "SHA-256";
        try {
            const publicKey = await window.crypto.subtle.importKey(
                "spki",
                base64ToArrayBuffer(publicKeyPem),
                {
                    name: "RSA-OAEP",
                    hash: hashAlgorithm
                },
                true,
                ["encrypt"]
            );

            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);

            const encryptedBuffer = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP",
                    hash: hashAlgorithm
                } as RsaOaepParams,
                publicKey,
                dataBuffer
            );

            // 转换为Base64字符串
            return arrayBufferToBase64(encryptedBuffer);
        } catch (error) {
            throw new Error('公钥加密失败，请检查公钥格式');
        }
    }

    // 辅助函数：Base64字符串转ArrayBuffer
    const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
        try {
            const binaryString = window.atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (error) {
            throw error;
        }
    }

    // 辅助函数：ArrayBuffer转Base64字符串
    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    //生成随机密钥
    const generateAndStoreKey = async (): Promise<void> => {
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                // 生成256位随机密钥 (32字节)
                const key = CryptoJS.lib.WordArray.random(32);
                // 生成128位随机IV (16字节)
                const iv = CryptoJS.lib.WordArray.random(16);

                // 存储原始密钥材料（使用Hex格式）
                sessionStorage.setItem(KEY_STORAGE_NAME, JSON.stringify({
                    key: key.toString(CryptoJS.enc.Hex),
                    iv: iv.toString(CryptoJS.enc.Hex)
                }));

                // 获取公钥并加密对称密钥
                const publicKey = await getPublicKey();

                // 加密对称密钥
                const encryptedKey = await encryptWithPublicKey(
                    key.toString(CryptoJS.enc.Hex),
                    publicKey
                );

                // 存储加密后的密钥
                sessionStorage.setItem(KEY_STORAGE_NAME + "_ENC", JSON.stringify({
                    encryptedKey,
                    iv: iv.toString(CryptoJS.enc.Hex)
                }));

                return;
            } catch (error) {
                retryCount++;
                if (retryCount >= maxRetries) {
                    sessionStorage.removeItem(KEY_STORAGE_NAME);
                    sessionStorage.removeItem(KEY_STORAGE_NAME + "_ENC");
                    throw new Error('多次尝试生成密钥失败，请检查网络和公钥');
                }
                // 重试前等待500ms
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    // 获取密钥材料（本地解密用）
    const getKeyMaterial = (): { key: CryptoJS.lib.WordArray; iv: CryptoJS.lib.WordArray } => {
        const raw = sessionStorage.getItem(KEY_STORAGE_NAME);
        if (!raw) throw new Error('未找到本地密钥');

        const { key, iv } = JSON.parse(raw);
        return {
            key: CryptoJS.enc.Hex.parse(key),
            iv: CryptoJS.enc.Hex.parse(iv)
        };
    }

    //获取加密的密钥材料（发送到后端用）
    const getEncryptedKeyMaterial = async (): Promise<{ encryptedKey: string; iv: string }> => {
        const raw = sessionStorage.getItem(KEY_STORAGE_NAME + "_ENC");
        if (!raw) {
            await generateAndStoreKey();
            return getEncryptedKeyMaterial();
        }
        return JSON.parse(raw);
    }

    return { KEY_STORAGE_NAME, generateAndStoreKey, getEncryptedKeyMaterial, getKeyMaterial }
}

