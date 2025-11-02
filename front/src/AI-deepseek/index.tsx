import { deepseekRequests } from '@/api/ai-deepseek';
import {
    FullscreenExitOutlined,
    FullscreenOutlined,
    SendOutlined
} from '@ant-design/icons';
import { Avatar, Drawer, Input, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AI from './index.module.scss';

interface aiProps {
    isOpenAi: boolean;
    isOpenAiFn: () => void;
}

interface MessageItem {
    id: number;
    content: string;
    username: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

const { TextArea } = Input;

export default function index({ isOpenAi, isOpenAiFn }: aiProps) {
    const [screenIsAll, setScreenIsAll] = useState(false);
    const [screenSize, setScreenSize] = useState('30%');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const messageListRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const userInfo = useSelector((state: any) => state.user.userInfo);
    const { aiDeepseekChat } = deepseekRequests();

    // 切换全屏状态
    const changeScreen = () => {
        setScreenIsAll(!screenIsAll);
        setScreenSize(screenIsAll ? '30%' : '100%');
    };

    // 关闭抽屉
    const onClose = () => {
        isOpenAiFn();
        setScreenSize('30%');
    };

    // 自动滚动到底部
    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    // 监听消息变化，自动滚动
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 发送消息
    const sendMessage = async () => {
        if (!inputValue.trim()) {
            message.warning('请输入消息内容');
            return;
        }

        // 添加用户消息
        const newUserMessage: MessageItem = {
            id: userInfo.user_id || Date.now(),
            content: inputValue,
            username: userInfo.name || '匿名用户',
            role: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        const response = await aiDeepseekChat({
            message: inputValue,
            history: messages
        });

        if (response.code === 200) {
            const aiReply: MessageItem = {
                id: userInfo.user_id || Date.now() + 1,
                content: response.data.reply || 'AI智能体回复失败',
                username: 'AI智能体',
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiReply]);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    // 处理回车键发送
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div id={AI.ai}>
            <Drawer
                className={AI.drawer}
                width={screenSize}
                title="AI智能体"
                closable={{ 'aria-label': 'Close Button' }}
                open={isOpenAi}
                mask={false}
                placement='right'
                getContainer={false}
                onClose={onClose}
                extra={
                    screenIsAll ?
                        <FullscreenOutlined onClick={changeScreen} /> :
                        <FullscreenExitOutlined onClick={changeScreen} />
                }
            >
                {/* 消息列表区域 */}
                <div
                    className={AI.messageList}
                    ref={messageListRef}
                >
                    {messages.length === 0 ? (
                        <div
                            className={AI.messageWelcome}>
                            欢迎使用AI智能体，请输入您的问题
                        </div>
                    ) : (
                        messages.map(message => (
                            <div
                                key={message.id}
                                className={AI.messageItem}
                                style={{ flexDirection: message.role === 'user' ? 'row-reverse' : 'row' }}
                            >
                                {/* 头像 */}
                                <div className={AI.avatarContainer}>
                                    <Avatar
                                        className={AI.avatar}
                                    >
                                        {message.role === 'user' ? '您' : 'AI'}
                                    </Avatar>
                                    <span className={AI.username}>{message.username}</span>
                                </div>

                                {/* 消息内容 */}
                                <div
                                    className={AI.messageContent}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))
                    )}

                    {/* 加载提示 */}
                    {isLoading && (
                        <div className={AI.loading}>
                            AI正在思考中...
                        </div>
                    )}
                </div>

                {/* 输入区域 */}
                <div className={AI.inputArea}>
                    <TextArea rows={3}
                        value={inputValue}
                        disabled={isLoading}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={handleKeyPress}
                        placeholder="请输入您的问题..."
                    />
                    <SendOutlined
                        className={AI.sendIcon}
                        onClick={sendMessage}
                    />
                </div>
            </Drawer>
        </div>
    );
}