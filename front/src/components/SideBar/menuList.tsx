import {
    StarOutlined
} from '@ant-design/icons';
import sideBar from './index.module.scss';

interface CurrentMenu {
    id?: number;
    title?: string;
    parent_id?: number;
    path?: string;
}

interface PropsValue {
    currentMenu: CurrentMenu;
    menuList: any;
}

interface NestedMenuItem extends CurrentMenu {
    children?: NestedMenuItem[];
}

// 转换为树形结构
const convertToNestedMenu = (
    flatList: CurrentMenu[],
    parentId?: number
): NestedMenuItem[] => {
    // 筛选出当前父级ID下的所有子菜单
    const children = flatList.filter(item => item.parent_id === parentId);

    // 递归处理每个子菜单，为其添加children属性
    return children.map(item => ({
        ...item,
        children: item.id ? convertToNestedMenu(flatList, item.id) : []
    }));
};

export const MenuList = ({ menuList, currentMenu }: PropsValue) => {
    const treeMenus = convertToNestedMenu(menuList, currentMenu.id)

    const a = () => {
        console.log('321312312')
    }

    return (
        <div className={sideBar.menuList}>
            {treeMenus.map((secondItem) => {
                return (
                    <div key={secondItem.id} className={sideBar.secondItem}>
                        <div className={sideBar.secondItemTitle}>
                            <span className={sideBar.spanIcon}></span>
                            <span>{secondItem.title}</span>
                        </div>
                        <ul className={sideBar.thirdItem}>
                            {secondItem.children?.length ? secondItem.children?.map((thirdItem) => {
                                return (
                                    <li key={thirdItem.id}>
                                        <span>{thirdItem.title}</span>
                                        <StarOutlined onClick={a} className={sideBar.thirdItemStar} />
                                    </li>
                                )
                            }) : null}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}