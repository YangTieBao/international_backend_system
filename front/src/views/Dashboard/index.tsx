import { menusRequests } from '@/api/menus';
import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import type { RootState } from '@/store';
import { changeCollapsed, getMenusState } from '@/store';
import { Watermark } from 'antd';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import dashbord from './index.module.scss';

export default function index() {
    const { user_id, name } = useSelector((state: RootState) => state.user.userInfo)
    const { getMenus } = menusRequests()
    const dispatch = useDispatch()
    const collapsed = useSelector((state: RootState) => state.common.collapsed)
    const dashboardRef = useRef<HTMLDivElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const toSmallClass = () => {
        let className = []
        if (collapsed) {
            className.push(dashbord.isToSmall)
        }
        return className.join(' ')
    }

    useEffect(() => {
        // 渲染菜单
        fetchMenus()

        resizeObserverRef.current = new ResizeObserver((entries) => {
            const targetEntry = entries[0];
            if (targetEntry) {
                const containerWidth = targetEntry.target.clientWidth;
                handleWidthChange(containerWidth);
            }
        })

        if (dashboardRef.current) {
            const initialWidth = dashboardRef.current.clientWidth
            handleWidthChange(initialWidth)

            resizeObserverRef.current.observe(dashboardRef.current)
        }

        return () => {
            if (resizeObserverRef.current && dashboardRef.current) {
                resizeObserverRef.current.unobserve(dashboardRef.current)
            }
        }
    }, [])

    const handleWidthChange = (width: number) => {
        if (width < 860) {
            dispatch(changeCollapsed(true));
        } else {
            dispatch(changeCollapsed(false));
        }
    };

    const fetchMenus = async () => {
        const response = await getMenus({ user_id: user_id })
        if (response.code === 200) {
            dispatch(getMenusState(response.data))
        }
    }

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 今天的日期
    const today = formatDate(new Date())

    const watermarkContent = name ? [name, today] : ['管理员', today]

    return (
        <div id={dashbord.dashbord} className={toSmallClass()} ref={dashboardRef}>
            <Watermark
                width={120}
                content={watermarkContent}
                className={dashbord.waterMark}
            >
                <div className={dashbord.sideBar}>
                    <SideBar />
                </div>
                <div className={dashbord.main}>
                    <div className={dashbord.topBar}>
                        <TopBar />
                    </div>
                    <section className={dashbord.section}>
                        <Outlet />
                    </section>
                </div>
            </Watermark>
        </div>
    )
}
