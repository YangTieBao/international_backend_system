import { pool } from '../config/database'

export const CommonsDao = () => {
    const getLanguageItems = async () => {
        const [languageItems] = await pool.query('select * from languages')
        return languageItems
    }

    const getTranslationContent = async (isRequireLogin: number, language: string) => {
        const sql = `select term,content from manual_translations where isRequireLogin = ? and language_code = ?`
        const [translationContents] = await pool.query(sql, [isRequireLogin, language])
        return translationContents
    }

    return { getLanguageItems, getTranslationContent }
}