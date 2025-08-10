import { useLanguage } from '@/hooks/useLanguage';
import type { RootState } from '@/store';
import { changeCollapsed } from '@/store';
import { messageFunctions } from '@/utils';
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
import { useNavigate } from 'react-router-dom';

import topBar from './index.module.scss';
export default function index() {
    const navigate = useNavigate();
    const { showSuccess } = messageFunctions();
    const [collapsed, setCollapsed] = useState(false);
    const { languageSelectItems, initLanguage, changeLanguage } = useLanguage()
    const dispatch = useDispatch()
    const userInfo = useSelector((state: RootState) => state.user.userInfo)


    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    };

    useEffect(() => {
        initLanguage()
    }, [])

    useEffect(() => {
        dispatch(changeCollapsed(collapsed))
    }, [collapsed]);

    const languageItems: MenuProps['items'] = languageSelectItems.map((lang: any) => ({
        key: lang.id,
        label: lang.native_name,
        onClick: () => {
            changeLanguage(lang.code)
        }
    }));

    const userItems: MenuProps['items'] = [
        {
            key: 1,
            label: '个人信息',
            onClick: () => {

            }
        },
        {
            key: 2,
            label: '国际化设置',
            onClick: () => {

            }
        },
        {
            key: 3,
            label: '修改密码',
            onClick: () => {

            }
        },
        {
            key: 4,
            label: '退出登录',
            onClick: () => {
                navigate('/login', { replace: true })
                sessionStorage.clear()
                showSuccess()
            }
        }
    ]

    return (
        <div id={topBar.topBar}>
            <Button type="text" onClick={toggleCollapsed} className={topBar.button}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <div className={topBar.topMenu}>
                
            </div>
            <div className={topBar.functions}>
                <EllipsisOutlined />
                <ReloadOutlined />
                <MessageOutlined />
                <Dropdown menu={{ items: languageItems }} placement="bottomLeft">
                    <TranslationOutlined />
                </Dropdown>
                <div className={topBar.user}>
                    <Dropdown menu={{ items: userItems }} placement="bottomLeft">
                        <div className={topBar.userSelect}>
                            <UserOutlined />
                            <span className={topBar.userName}>
                                {userInfo.name}
                            </span>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div >
    )
}