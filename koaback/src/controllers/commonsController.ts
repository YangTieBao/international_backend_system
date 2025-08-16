import { Context, Next } from 'koa';
import { CommonsDao } from '../daos/commonsDao';
import { encrypt_decrypt, errors } from '../utils';

const { routerError } = errors()
const { setPublicKey } = encrypt_decrypt()

export const commonsController = () => {
    const commonsDao = CommonsDao()

    const getPublicKey = (ctx: Context) => {
        try {
            ctx.body = {
                data: { publicKey: setPublicKey() }
            }
        } catch (err) {
            routerError('commonsController/getPublicKey', err, ctx)
        }
    }

    const languages = async (ctx: Context, next: Next) => {
        try {
            const { language, isLogin } = ctx.request.body as any
            // 获取的翻译内容是否需要登录
            const isRequireLogin = isLogin ? 1 : 0

            const languageItems = await commonsDao.getLanguageItems()

            const translationContents = await commonsDao.getTranslationContent(isRequireLogin, language)
            const translationContentsObject = formatTranslations(translationContents)

            ctx.body = {
                data: { languageItems, translationContentsObject }
            }

            await next()
        } catch (err) {
            routerError('commonsController/languages', err, ctx)
        }
    }

    const formatTranslations = (rows: any) => {
        const result = {};

        rows.forEach((row: any) => {
            const { term, content } = row;
            const keys = term.split('.');

            let current: any = result;
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

    return { getPublicKey, languages }
}