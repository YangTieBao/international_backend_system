import iconSrc from '@/assets/images/icon1.png';
import type { RootState } from '@/store';
import {
    CloseOutlined,
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Drawer, Menu } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import sideBar from './index.module.scss';

export default function index() {
    const menus = useSelector((state: RootState) => state.user.userMenus)
    const collapsed = useSelector((state: RootState) => state.common.collapsed)
    const sortMenus = [...menus].sort((a, b) => a.sort - b.sort)
    const [open, setOpen] = useState(false);

    type MenuItem = Required<MenuProps>['items'][number];

    const toSmallClass = () => {
        let className = []
        if (collapsed) {
            className.push(sideBar.isToSmall)
        }
        return className.join(' ')
    }

    const items: MenuItem[] = sortMenus.map(menu => {
        const IconComponent = getIconComponent(menu.icon);

        return {
            key: menu.id,
            icon: IconComponent ? <IconComponent /> : null,
            label: menu.title,
            onClick: () => {
                showDrawer()
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

    const showDrawer = () => {
        setOpen(true)
    };

    const onClose = () => {
        setOpen(false)
    };

    return (
        <div id={sideBar.sideBar} className={toSmallClass()}>
            <div className={sideBar.topIcon}>
                <img src={iconSrc}></img>
                <span>国际化管理平台</span>
            </div>
            <Menu
                className={sideBar.menu}
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
                items={items}
            />
            <Drawer
                className={sideBar.drawer}
                title="Basic Drawer"
                placement="left"
                closable={false}
                onClose={onClose}
                open={open}
                getContainer={false}
                extra={
                    <Button onClick={onClose}><CloseOutlined /></Button>
                }
            >
                <p>Some contents...</p>
            </Drawer>
        </div>
    )
}
