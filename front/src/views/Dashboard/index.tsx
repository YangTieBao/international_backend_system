import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import { Watermark } from 'antd';
import dashbord from './index.module.scss';
export default function index() {
    return (
        <div id={dashbord.dashbord}>
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
