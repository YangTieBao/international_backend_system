
export interface EncryptedRequestBody {
    encryptedData?: string;
    encryptedKey: string;
    iv: string;
    hashAlgorithm: string;
    isEncryptResponse: boolean;
}

export interface ResponseBody {
    code?: number;
    data?: any;
    message?: string;
}