import { message } from 'antd';

const defaultDuration = 3; // 默认3秒关闭
const defaultTop = 24; // 距离顶部像素

export const messageFunctions = () => {
    // 成功消息
    const showSuccess = (content: string = '操作成功', duration: number = defaultDuration) => {
        message.open({
            type: 'success',
            content,
            duration,
            style: { top: defaultTop }
        });
    };

    // 错误消息
    const showError = (content: string = '操作失败', duration: number = defaultDuration) => {
        message.open({
            type: 'error',
            content,
            duration,
            style: { top: defaultTop },
        });
    };

    // 警告消息
    const showWarning = (content: string, duration: number = defaultDuration) => {
        message.open({
            type: 'warning',
            content,
            duration,
            style: { top: defaultTop },
        });
    };

    // 信息提示
    const showInfo = (content: string, duration: number = defaultDuration) => {
        message.open({
            type: 'info',
            content,
            duration,
            style: { top: defaultTop },
        });
    };

    // 等待
    const showLoading = (key: string, content: string = '正在请求中，请等待...', duration: number = 0) => {
        message.open({
            type: 'loading',
            content,
            duration,
            key,
            style: { top: defaultTop },
        });
    }

    const destroyMessage = (key: string) => {
        message.destroy(key)
    }

    return { showSuccess, showError, showInfo, showWarning, showLoading, destroyMessage }
}
