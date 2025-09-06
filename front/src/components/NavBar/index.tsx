import { Tabs } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import navbar from './index.module.scss';

interface InitialItem {
    key: number | string;
    label: string;
    children?: any; // 内容
    closable?: boolean;
}

interface NavbarProps {
    initialItems: InitialItem[];
}

export interface ChildMethods {
    addTab: (newTab: InitialItem) => void;
}

const index = forwardRef<ChildMethods, NavbarProps>(({ initialItems }, ref) => {
    const processedItems = initialItems.map(item => {
        return {
            ...item,
            key: String(item.key)
        }
    })

    const [items, setItems] = useState(processedItems);
    const [activeKey, setActiveKey] = useState(processedItems[0].key);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    // 子组件内部方法：添加标签
    const addTab = (newTab: InitialItem) => {
        const tabWithStringKey = { ...newTab, key: String(newTab.key) };
        setItems(prev => [...prev, tabWithStringKey]);
        setActiveKey(tabWithStringKey.key);
    };

    // 子组件内部方法：移除标签
    const removeTab = (targetKey: string | number) => {
        const stringKey = String(targetKey);
        let newActiveKey = activeKey;
        let lastIndex = -1;

        items.forEach((item, i) => {
            if (item.key === stringKey) lastIndex = i - 1;
        });

        const newPanes = items.filter(item => item.key !== stringKey);
        if (newPanes.length && newActiveKey === stringKey) {
            newActiveKey = lastIndex >= 0 ? newPanes[lastIndex].key : newPanes[0].key;
        }

        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (key: any, action: any) => {
        if (action == 'remove') {
            removeTab(key)
        }
    }

    // 通过useImperativeHandle暴露指定方法给父组件
    useImperativeHandle(ref, () => ({
        addTab    // 暴露添加标签方法
    }), []); // 依赖为空数组，方法引用稳定

    return (
        <div className={navbar.navbar}>
            <Tabs
                type="editable-card"
                className={navbar.tabs}
                onChange={onChange}
                onEdit={onEdit}
                activeKey={activeKey}
                items={items}
                hideAdd
                size='small'
            />
        </div>
    )
})

export default index

