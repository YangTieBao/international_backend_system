import type { RootState } from '@/store';
import { changeCollapsed } from '@/store';
import {
    EllipsisOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MessageOutlined,
    ReloadOutlined,
    TranslationOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import topBar from './index.module.scss';
export default function index() {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch()
    const userInfo = useSelector((state: RootState) => state.user.userInfo)


    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    };

    useEffect(() => {
        dispatch(changeCollapsed(collapsed))
    }, [collapsed]);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item
                </a>
            ),
        },
    ];

    return (
        <div id={topBar.topBar}>
            <Button onClick={toggleCollapsed} className={topBar.button}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <div className={topBar.topMenu}>

            </div>
            <div className={topBar.functions}>
                <EllipsisOutlined />
                <ReloadOutlined />
                <MessageOutlined />
                <Dropdown menu={{ items }} placement="bottomLeft">
                    <Button className={topBar.button}><TranslationOutlined /></Button>
                </Dropdown>
                <div className={topBar.user}>
                    <UserOutlined />
                    <span className={topBar.userName}>
                        {userInfo ? userInfo.name : "管理员"}
                    </span>
                </div>
            </div>
        </div>
    )
}