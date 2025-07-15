import CryptoJS from 'crypto-js';

// 密钥存储键名（使用sessionStorage）
const KEY_STORAGE_NAME = "__APP_AES_KEY__";
const PUBLIC_KEY_STORAGE = "__APP_PUBLIC_KEY__";

// 后端公钥获取端点
const PUBLIC_KEY_URL = "/api/public-key";

/**
 * 获取后端公钥（带缓存和格式清洗）
 */
async function getPublicKey(): Promise<string> {
    const cachedKey = sessionStorage.getItem(PUBLIC_KEY_STORAGE);
    if (cachedKey) return cleanPublicKey(cachedKey);

    try {
        const response = await fetch(PUBLIC_KEY_URL);
        if (!response.ok) throw new Error('公钥获取失败');

        const publicKey = await response.text();
        const cleanedKey = cleanPublicKey(publicKey);
        sessionStorage.setItem(PUBLIC_KEY_STORAGE, cleanedKey);
        return cleanedKey;
    } catch (error) {
        console.error('公钥获取错误:', error);
        throw new Error('无法获取加密公钥');
    }
}

/**
 * 清洗公钥格式（移除标记和空白）
 */
function cleanPublicKey(publicKey: string): string {
    return publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s+/g, '');
}

/**
 * Web Crypto API类型扩展
 */
interface RsaOaepParams extends Algorithm {
    name: "RSA-OAEP";
    hash: string | Algorithm;
    label?: ArrayBuffer;
}

/**
 * 使用Web Crypto API进行RSA加密（带类型定义）
 */
async function encryptWithPublicKey(data: string, publicKeyPem: string): Promise<string> {
    const hashAlgorithm = "SHA-256";
    try {
        // 1. 导入公钥
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

        // 2. 准备要加密的数据
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        // 3. 执行加密（使用正确的类型定义）
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
                hash: hashAlgorithm
            } as RsaOaepParams,
            publicKey,
            dataBuffer
        );

        // 4. 转换为Base64字符串
        return arrayBufferToBase64(encryptedBuffer);
    } catch (error) {
        console.error('RSA加密失败详情:', error);
        throw new Error('公钥加密失败，请检查公钥格式');
    }
}

// 辅助函数：Base64字符串转ArrayBuffer（带错误处理）
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    try {
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    } catch (error) {
        console.error('Base64解码失败，输入字符串:', base64.substring(0, 50) + '...');
        throw error;
    }
}

// 辅助函数：ArrayBuffer转Base64字符串
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * 生成并存储随机密钥（带错误重试）
 */
async function generateAndStoreKey(): Promise<void> {
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
            console.error(`密钥生成失败 (重试 ${retryCount}/3):`, error);
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

/**
 * 获取密钥材料（本地解密用）
 */
function getKeyMaterial(): { key: CryptoJS.lib.WordArray; iv: CryptoJS.lib.WordArray } {
    const raw = sessionStorage.getItem(KEY_STORAGE_NAME);
    if (!raw) throw new Error('未找到本地密钥');

    const { key, iv } = JSON.parse(raw);
    return {
        key: CryptoJS.enc.Hex.parse(key),
        iv: CryptoJS.enc.Hex.parse(iv)
    };
}

/**
 * 获取加密的密钥材料（发送到后端用）
 */
async function getEncryptedKeyMaterial(): Promise<{ encryptedKey: string; iv: string }> {
    const raw = sessionStorage.getItem(KEY_STORAGE_NAME + "_ENC");
    if (!raw) {
        await generateAndStoreKey();
        return getEncryptedKeyMaterial();
    }
    return JSON.parse(raw);
}

/**
 * AES加密：明文 -> 密文
 */
/**
 * AES加密：支持可选参数加密
 */
export async function encrypt(
  data?: object | string
): Promise<{
  encryptedData?: string;
  encryptedKey: string;
  iv: string;
  hashAlgorithm: string;
}> {
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

/**
 * 本地AES解密
 */
export function decrypt(ciphertext: string): string {
    try {
        const { key,iv } = getKeyMaterial();

        const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('解密错误:', error);
        throw new Error('数据解密失败');
    }
}
