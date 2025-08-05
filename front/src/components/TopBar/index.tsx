import { changeCollapsed } from '@/store';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import topBar from './index.module.scss';
export default function index() {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch()

    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    };

    useEffect(() => {
        dispatch(changeCollapsed(collapsed))
    }, [collapsed]);

    return (
        <div id={topBar.topBar}>
            <Button type="link" onClick={toggleCollapsed} className={topBar.button}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
        </div>
    )
}