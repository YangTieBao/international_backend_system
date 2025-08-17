import { useLanguage } from '@/hooks/useLanguage';
import type { RootState } from '@/store';
import { changeCollapsed } from '@/store';
import { messageFunctions } from '@/utils';
import {
    DoubleLeftOutlined,
    DoubleRightOutlined,
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
import { TopMenu } from './topMenu';

import topBar from './index.module.scss';
export default function index() {
    const navigate = useNavigate();
    const { showSuccess } = messageFunctions();
    const [collapsed, setCollapsed] = useState(false);
    const [scrollDirection, setScrollDirection] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [count, setCount] = useState(0);
    const { languageSelectItems, initLanguage, changeLanguage } = useLanguage()
    const dispatch = useDispatch()
    const userInfo = useSelector((state: RootState) => state.user.userInfo)

    // 初始化
    useEffect(() => {
        initLanguage()
    }, [])

    // 监听
    useEffect(() => {
        dispatch(changeCollapsed(collapsed))
    }, [collapsed]);

    // 切换菜单收缩与扩展
    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    };

    // 滑动菜单
    const scrollMenu = (direction: string) => {
        setCount(prev => prev + 1)
        setScrollDirection(direction)
    }

    // 切换是否显示
    const onChange = (isShow: boolean) => {
        setIsShow(isShow)
    }

    const languageItems: MenuProps['items'] = languageSelectItems ? languageSelectItems.map((lang: any) => ({
        key: lang.id,
        label: lang.native_name,
        onClick: () => {
            changeLanguage(lang.code)
        }
    })) : [];

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
            <DoubleLeftOutlined
                style={isShow ? { display: 'flex' } : { display: 'none' }}
                className={topBar.leftIcon}
                onClick={() => scrollMenu('left')} 
            />
            <TopMenu 
                count={count} 
                scrollDirection={scrollDirection} 
                onChange={onChange} 
            />
            <DoubleRightOutlined
                style={isShow ? { display: 'flex' } : { display: 'none' }}
                className={topBar.rightIcon}
                onClick={() => scrollMenu('right')} 
            />
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