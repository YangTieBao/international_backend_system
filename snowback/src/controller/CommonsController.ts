import { Body, Controller, Get, Post } from '@snow';
import { encrypt_decrypt } from '@utils/crypto';
import { errors } from '@utils/errors';
import { responses } from '@utils/response';
import { LanguagesDao } from 'src/dao/LanguagesDao';
import { TranslationsDao } from 'src/dao/TranslationsDao';

const { return_200, return_500 } = responses()
const { routerError } = errors()
const { getPublicKey, handleEncryptedRequest } = encrypt_decrypt()

@Controller('/commons')
export default class CommonsController {
    private readonly languagesDao = new LanguagesDao();
    private readonly translationsDao = new TranslationsDao();

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
    async languages(@Body() body) {
        try {
            const { symmetricKey, jsonDecryptedData } = handleEncryptedRequest(body)
            const { language, isLogin } = jsonDecryptedData
            // 获取的翻译内容是否需要登录
            const isRequireLogin = isLogin ? 1 : 0

            const languageItems = await this.languagesDao.select()

            const sql = `select term,content from manual_translations where isRequireLogin = ? and language_code = ?`
            const translationContents = await TranslationsDao.query(sql, [isRequireLogin, language])
            const translationContentsObject = this.formatTranslations(translationContents)

            return return_200({ languageItems, translationContentsObject }, symmetricKey, body)
        } catch (err) {
            routerError('/commons/languages', err)
        }
    }

    private formatTranslations = (rows) => {
        const result = {};

        rows.forEach(row => {
            const { term, content } = row;
            const keys = term.split('.');

            let current = result;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (i === keys.length - 1) {
                    current[key] = content;
                } else {
                    if (!current[key]) {
                        current[key] = {};
                    }
                    current = current[key];
                }
            }
        });

        return result;
    };
}