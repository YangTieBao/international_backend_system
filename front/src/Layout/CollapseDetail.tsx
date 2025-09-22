import ButtonList from '@/components/ButtonList';
import { Collapse } from 'antd';
import './index.scss';

interface CollapseItem {
    key: string;
    label: string;
    children: any;
}

interface CollapseItems {
    collapseItems: CollapseItem[];
    buttonList?: any;
    defaultActiveKey?: any;
}
export default function index({ collapseItems, buttonList, defaultActiveKey = ['1'] }: CollapseItems) {
    return (
        <div className='collapseDetail'>
            <Collapse items={collapseItems} defaultActiveKey={defaultActiveKey} size="small" />
            <div className='buttonList'>
                <ButtonList buttonList={buttonList} height='40px' align='right'></ButtonList>
            </div>
        </div >
    )
}

