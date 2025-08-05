import type { RootState } from '@/store';
import {
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';
import sideBar from './index.module.scss';

export default function index() {
    const menus = useSelector((state: RootState) => state.user.userMenus)
    const collapsed = useSelector((state: RootState) => state.common.collapsed)
    const sortMenus = [...menus].sort((a, b) => a.sort - b.sort)

    type MenuItem = Required<MenuProps>['items'][number];

    const menuClass = () => {
        let className = [sideBar.menu]
        if (collapsed) {
            className.push(sideBar.isToSmall)
        }
        return className.join(' ')
    }

    const iconClass = () => {
        let className = [sideBar.topIcon]
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
            <div className={iconClass()}>
            </div>
            <Menu
                className={menuClass()}
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
                items={items}
            />
        </div>
    )
}
