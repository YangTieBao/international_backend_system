import { message } from 'antd';

const defaultDuration = 3; // 默认3秒关闭
const defaultTop = 24; // 距离顶部像素

export const messageFunctions = () => {
    // 成功消息
    const showSuccess = (content: string) => {
        message.open({
            type: 'success',
            content,
            duration: defaultDuration,
            style: { top: defaultTop }
        });
    };

    // 错误消息
    const showError = (content: string) => {
        message.open({
            type: 'error',
            content,
            duration: defaultDuration,
            style: { top: defaultTop },
        });
    };

    // 警告消息
    const showWarning = (content: string) => {
        message.open({
            type: 'warning',
            content,
            duration: defaultDuration,
            style: { top: defaultTop },
        });
    };

    // 信息提示
    const showInfo = (content: string) => {
        message.open({
            type: 'info',
            content,
            duration: defaultDuration,
            style: { top: defaultTop },
        });
    };

    return { showSuccess, showError, showInfo, showWarning }
}
