import iconSrc from '@/assets/images/icon1.png';
import type { RootState } from '@/store';
import {
    CloseOutlined,
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import type { AutoCompleteProps, MenuProps } from 'antd';
import { AutoComplete, Button, Drawer, Menu } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import sideBar from './index.module.scss';
import { MenuList } from './menuList';

export default function index() {
    const menus = useSelector((state: RootState) => state.user.userMenus)
    const collapsed = useSelector((state: RootState) => state.common.collapsed)
    const sortMenus = [...menus].sort((a, b) => a.sort - b.sort)
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
    const [currentMenu, setCurrentMenu] = useState<any>({})

    type MenuItem = Required<MenuProps>['items'][number];

    const toSmallClass = () => {
        let className = []
        if (collapsed) {
            className.push(sideBar.isToSmall)
        }
        return className.join(' ')
    }

    const handleSearch = (value: string) => {
        setOptions(() => {
            if (!value) {
                return [];
            }
            const filteredMenus = sortMenus.filter(menu =>
                menu.title.toLowerCase().includes(value.toLowerCase())
            );
            return filteredMenus.map(menu => ({
                label: menu.title,
                value: menu.id
            }));
        });
    };

    const items: MenuItem[] = sortMenus.map(menu => {
        const IconComponent = getIconComponent(menu.icon);

        if (menu.parent_id == 0) {
            return {
                key: menu.id,
                icon: IconComponent ? <IconComponent /> : null,
                label: menu.title,
                onClick: () => {
                    setCurrentMenu(menu)
                    showDrawer()
                }
            };
        }
        return null;
    }).filter(Boolean);

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
            <div className={sideBar.top}>
                <div className={sideBar.topIcon}>
                    <img src={iconSrc}></img>
                    <span>国际化管理平台</span>
                </div>
                <AutoComplete
                    className={sideBar.autoSearch}
                    onSearch={handleSearch}
                    placeholder="请输入关键词搜索"
                    options={options}
                />
            </div>
            <Menu
                className={sideBar.menu}
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                items={items}
            />
            <Drawer
                className={sideBar.drawer}
                width={'50%'}
                title={currentMenu.title}
                placement="left"
                mask={false}
                closable={false}
                onClose={onClose}
                open={open}
                getContainer={false}
                extra={
                    <Button onClick={onClose}><CloseOutlined /></Button>
                }
            >
                <MenuList menuList={sortMenus} currentMenu={currentMenu} />
            </Drawer>
        </div>
    )
}
