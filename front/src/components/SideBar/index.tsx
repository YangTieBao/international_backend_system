import type { RootState } from '@/store';
import {
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import sideBar from './index.module.scss';

export default function index() {
    const [collapsed, setCollapsed] = useState(false);
    const menus = useSelector((state: RootState) => state.user.userMenus)
    const sortMenus = [...menus].sort((a, b) => a.sort - b.sort)

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    type MenuItem = Required<MenuProps>['items'][number];

    const items: MenuItem[] = sortMenus.map(menu => {
        const IconComponent = getIconComponent(menu.icon);

        return {
            key: menu.id,
            icon: IconComponent ? <IconComponent /> : null,
            label: menu.title,
            onClick: () => {
                console.log('432432', menu.title)
            }
        };
    });

    function getIconComponent(iconType: string) {
        const iconMap = {
            'PieChartOutlined': PieChartOutlined,
            'DesktopOutlined': DesktopOutlined,
            'ContainerOutlined': ContainerOutlined,
        };
        return iconMap[iconType as keyof typeof iconMap];
    }


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
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
                items={items}
            />
        </div>
    )
}
