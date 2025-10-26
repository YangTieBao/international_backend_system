import {
    FullscreenExitOutlined,
    FullscreenOutlined
} from '@ant-design/icons';
import { Drawer } from 'antd';
import { useState } from 'react';
import AI from './index.module.scss';

interface aiProps {
    isOpenAi: boolean;
    isOpenAiFn: () => void;
}

export default function index({ isOpenAi, isOpenAiFn }: aiProps) {
    const [screenIsAll, setScreenIsAll] = useState(false)
    const [screenSize, setScreenSize] = useState('30%')
    const onClose = () => {
        isOpenAiFn()
        setScreenSize('30%')
    }
    const changeScreen = () => {
        setScreenIsAll(!screenIsAll)
        if (screenSize === '30%') {
            setScreenSize('100%')
        } else {
            setScreenSize('30%')
        }
    }
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
                    screenIsAll ? <FullscreenOutlined onClick={changeScreen} /> : <FullscreenExitOutlined onClick={changeScreen} />
                }
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>
    )
}
