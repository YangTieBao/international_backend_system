import type { ChildMethods } from '@/components/NavBar'
import NavBar from '@/components/NavBar'
import { useRef } from 'react'
import List from './list'

export default function index() {
    const navbarRef = useRef<ChildMethods>(null)

    const handleAddTab = (newTab: any) => {
        navbarRef.current?.addTab(newTab);
    };

    const handleRemoveTab = (tabKey: string) => {
        navbarRef.current?.removeTab(tabKey);
    }

    const initialItems = [
        {
            key: 1,
            label: '菜单管理列表',
            children: <List addTab={handleAddTab} removeTab={handleRemoveTab} />,
            closable: false
        },
    ]

    return (
        <NavBar ref={navbarRef} initialItems={initialItems}></NavBar>
    )
}
