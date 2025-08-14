import type { RootState } from '@/store';
import { activeRoute, filterTopMenus } from '@/store';
import {
    CloseOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import topBar from './index.module.scss';

export const TopMenu = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const topMenus = useSelector((state: RootState) => state.menu.topMenus)
    const [prevLength, setPrevLength] = useState(topMenus.length);

    // 监听topMenus菜单的变化
    useEffect(() => {
        if (topMenus.length < prevLength) {
            const lastItem = topMenus[topMenus.length - 1];
            if (lastItem?.path) {
                navigate(lastItem.path)
                dispatch(activeRoute(lastItem))
            } else {
                navigate('/dashboard/home');
                dispatch(activeRoute({ id: 1 }))
            }
        }
    }, [topMenus, prevLength, navigate]);

    const filterMenuItem = (e: React.MouseEvent, id: number = 0) => {
        e.stopPropagation()
        if (id === 0) {
            return;
        }
        setPrevLength(topMenus.length);
        dispatch(filterTopMenus(id))
    }

    const skipRoute = (item: any) => {
        navigate(item.path)
        dispatch(activeRoute(item))
    }

    return (
        <div className={topBar.topMenu}>
            <DoubleLeftOutlined className={topBar.leftIcon} />
            <section className={`${topBar.topMenuList} ${topBar.isFirst}`}>
                {topMenus.map((item) => {
                    return (
                        <div key={item.id} className={`${topBar.topMenuItem} ${item.isActived ? topBar.isActived : ''}`} onClick={() => skipRoute(item)} >
                            <span>{item.title}</span>
                            <CloseOutlined className={topBar.close} onClick={e => filterMenuItem(e, item.id)} />
                        </div>
                    )
                })}
            </section>
            <DoubleRightOutlined className={topBar.rightIcon} />
        </div>
    )
}