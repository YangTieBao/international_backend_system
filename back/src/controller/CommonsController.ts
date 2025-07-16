import { Controller } from '@snow';
import { encrypt_decrypt } from '@utils/crypto';

const { getPublicKey, handleGetEncryptedRequest, handlePostEncryptedRequest, prepareEncryptedResponse } = encrypt_decrypt();

@Controller('/commons')
export default class CommonsController {
    
}