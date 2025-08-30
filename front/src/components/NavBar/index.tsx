import { Tabs } from 'antd';
import { useRef, useState } from 'react';
import navbar from './index.module.scss';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface InitialItem {
    key: number | string;
    label: string;
    children?: any; // 内容
    closable?: boolean;
}

interface NavbarProps {
    initialItems: InitialItem[];
}

export default function index({ initialItems }: NavbarProps) {
    const processedItems = initialItems.map(item => {
        return {
            ...item,
            key: String(item.key)
        }
    })
    const [activeKey, setActiveKey] = useState(processedItems[0].key);
    const [items, setItems] = useState(processedItems);
    const newTabIndex = useRef(0);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        newPanes.push({ label: 'New Tab', children: 'Content of new Tab', key: newActiveKey });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const remove = (targetKey: TargetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    return (
        <div className={navbar.navbar}>
            <Tabs
                type="editable-card"
                className={navbar.tabs}
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={items}
                hideAdd
                size='small'
            />
        </div>
    )
}
