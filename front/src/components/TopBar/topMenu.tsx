import type { RootState } from '@/store';
import { activeRoute, filterTopMenus } from '@/store';
import {
    CloseOutlined
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useLocation } from 'react-router-dom';
import topBar from './index.module.scss';

interface PropsValue {
    count: number;
    scrollDirection: string;
    onChange: (isShow: boolean) => void;
}

export const TopMenu = ({ count, scrollDirection, onChange }: PropsValue) => {
    const localtion = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const topMenus = useSelector((state: RootState) => state.menu.topMenus)
    const [prevLength, setPrevLength] = useState(topMenus.length);
    const [isMaxWidth, setIsMaxWidth] = useState(false)
    const menuListRef = useRef(null);
    const scrollUnit = 90

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
        checkOverflow()
    }, [topMenus, prevLength, navigate]);

    // 监听是否为左侧的工作台触发的路由变化
    useEffect(()=>{
        if(localtion.pathname === '/dashboard/home'){
            dispatch(activeRoute({id:1}))
        }

    },[localtion])


    // 监听scrollValue变化，触发滚动
    useEffect(() => {
        if (menuListRef.current) {
            const menuListRefType = menuListRef.current as any
            const { scrollLeft, scrollWidth, clientWidth } = menuListRefType;
            const maxScroll = scrollWidth - clientWidth; // 最大可滚动距离

            // 左侧剩余可滚动距离（向左最多能滚多少）
            const leftRemaining = scrollLeft;
            // 右侧剩余可滚动距离（向右最多能滚多少）
            const rightRemaining = maxScroll - scrollLeft;

            if (scrollDirection === 'left') {
                const actualScroll = Math.min(leftRemaining, scrollUnit);
                const newScrollValue = scrollLeft - actualScroll;
                menuListRefType.scrollTo({ left: newScrollValue, behavior: 'smooth' });
            } else {
                const actualScroll = Math.min(rightRemaining, scrollUnit);
                const newScrollValue = scrollLeft + actualScroll;
                menuListRefType.scrollTo({ left: newScrollValue, behavior: 'smooth' });
            }
        }
    }, [count, scrollDirection]);

    useEffect(() => {
        checkOverflow();
        // 可选：监听窗口大小变化，动态检测（即使在空依赖中也可添加）
        const handleResize = () => checkOverflow();
        window.addEventListener('resize', handleResize);

        // 清理函数：移除事件监听
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 检测是否内容溢出
    const checkOverflow = () => {
        if (menuListRef.current) {
            const { scrollWidth, clientWidth } = menuListRef.current;
            onChange(scrollWidth > clientWidth)
            setIsMaxWidth(scrollWidth > clientWidth)
            return;
        }

        onChange(false)
        setIsMaxWidth(false)
    };


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
            <section
                ref={menuListRef}
                className={`${topBar.topMenuList} ${topBar.isFirst} ${isMaxWidth ? topBar.maxWidth : ''}`}
            >
                {topMenus.map((item) => {
                    return (
                        <div key={item.id} className={`${topBar.topMenuItem} ${item.isActived ? topBar.isActived : ''}`} onClick={() => skipRoute(item)} >
                            <span>{item.title}</span>
                            <CloseOutlined className={topBar.close} onClick={e => filterMenuItem(e, item.id)} />
                        </div>
                    )
                })}
            </section>
        </div>
    )
}