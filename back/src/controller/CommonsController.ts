import { Body, Controller, Get, Post } from '@snow';
import { encrypt_decrypt } from '@utils/crypto';
import { errors } from '@utils/errors';
import { responses } from '@utils/response';

const { return_200, return_500 } = responses()
const { routerError } = errors()
const { getPublicKey, handleEncryptedRequest } = encrypt_decrypt()

@Controller('/commons')
export default class CommonsController {
    @Get('/getPublicKey')
    getPublicKey() {
        try {
            return {
                code: 200,
                msg: '请求成功',
                data: { publicKey: getPublicKey() }
            }
        } catch (err) {
            routerError('/commons/getPublicKey', err)
        }
    }

    @Post('/languages')
    languages(@Body() body) {
        try {
            const { symmetricKey, jsonDecryptedData } = handleEncryptedRequest(body)
            const data = { msg: 1111111 }
            return return_200(data, symmetricKey, body)
        } catch (err) {
            routerError('/commons/languages', err)
        }
    }
}