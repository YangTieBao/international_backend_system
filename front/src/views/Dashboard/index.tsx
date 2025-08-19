import { menusRequests } from '@/api/menus';
import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import type { RootState } from '@/store';
import { getMenusState } from '@/store';
import { Watermark } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import dashbord from './index.module.scss';

export default function index() {
    const { user_id, name } = useSelector((state: RootState) => state.user.userInfo)
    const { getMenus } = menusRequests()
    const dispatch = useDispatch()
    const collapsed = useSelector((state: RootState) => state.common.collapsed)
    const toSmallClass = () => {
        let className = []
        if (collapsed) {
            className.push(dashbord.isToSmall)
        }
        return className.join(' ')
    }

    useEffect(() => {
        fetchMenus()
    }, [])

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
        <div id={dashbord.dashbord} className={toSmallClass()}>
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
