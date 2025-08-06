import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import type { RootState } from '@/store';
import { Watermark } from 'antd';
import { useSelector } from 'react-redux';
import dashbord from './index.module.scss';
export default function index() {
    const collapsed = useSelector((state: RootState) => state.common.collapsed)
    const toSmallClass = () => {
        let className = []
        if (collapsed) {
            className.push(dashbord.isToSmall)
        }
        return className.join(' ')
    }
    return (
        <div id={dashbord.dashbord} className={toSmallClass()}>
            <Watermark content="admin" className={dashbord.waterMark}>
                <div className={dashbord.sideBar}>
                    <SideBar />
                </div>
                <div className={dashbord.main}>
                    <div className={dashbord.topBar}>
                        <TopBar />
                    </div>
                </div>
            </Watermark>
        </div>
    )
}
