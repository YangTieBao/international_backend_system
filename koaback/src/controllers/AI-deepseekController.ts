const axios = require('axios');
import { Context, Next } from 'koa';
import { errors } from '../utils';

const { routerError } = errors()

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL

/**
 * 调用 DeepSeek API 生成响应
 * @param {string} message - 用户当前输入消息
 * @param {Array} history - 对话历史（[{role: 'user'|'assistant', content: string}]）
 * @returns {string} 智能体回复
 */
const generateResponse = async (message: string, history: any[]) => {
    try {
        const requestData = {
            model: 'deepseek-chat', // 模型名称
            messages: [
                ...history.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: 'user', content: message }
            ],
            temperature: 0.7, // 随机性（0-1，值越高越随机）
            max_tokens: 1024 // 最大回复长度
        };

        // 调用 DeepSeek API
        const response = await axios.post(DEEPSEEK_API_URL, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}` // 认证方式
            }
        });

        return response.data.choices[0].message.content.trim();

    } catch (error: any) {
        console.error('调用 DeepSeek API 出错:', error.response ? error.response.data : error.message);
    }
};

export const deepseekController = () => {
    const aiDeepseekChat = async (ctx: Context, next: Next) => {
        try {
            const { message, history = [] } = ctx.request.body as any;
            const response = await generateResponse(message, history);
            ctx.body = { data: { reply: response } };
            await next();
        } catch (error) {
            routerError('deepseekController/chat', error, ctx);
        }
    };

    return { aiDeepseekChat };
};
