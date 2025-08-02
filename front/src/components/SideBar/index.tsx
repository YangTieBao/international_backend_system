import {
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import sideBar from './index.module.scss';
export default function index() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    type MenuItem = Required<MenuProps>['items'][number];

    const items: MenuItem[] = [
        { key: '1', icon: <PieChartOutlined />, label: 'Option 1' },
        { key: '2', icon: <DesktopOutlined />, label: 'Option 2' },
        { key: '3', icon: <ContainerOutlined />, label: 'Option 3' },
        { key: '4', icon: <PieChartOutlined />, label: 'Option 4' },
        { key: '5', icon: <DesktopOutlined />, label: 'Option 5' },
        { key: '6', icon: <ContainerOutlined />, label: 'Option 6' },
        { key: '7', icon: <PieChartOutlined />, label: 'Option 7' },
        { key: '8', icon: <DesktopOutlined />, label: 'Option 8' },
        { key: '9', icon: <ContainerOutlined />, label: 'Option 9' },
        { key: '10', icon: <PieChartOutlined />, label: 'Option 10' },
        { key: '11', icon: <DesktopOutlined />, label: 'Option 11' },
        { key: '12', icon: <ContainerOutlined />, label: 'Option 12' },
        { key: '13', icon: <PieChartOutlined />, label: 'Option 13' },
        { key: '14', icon: <DesktopOutlined />, label: 'Option 14' },
        { key: '15', icon: <ContainerOutlined />, label: 'Option 15' }
    ];
    return (
        <div id={sideBar.sideBar}>
            <div className={sideBar.topIcon}>
            </div>
            {/* <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button> */}
            <Menu
                className={sideBar.menu}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
                items={items}
            />
        </div>
    )
}
