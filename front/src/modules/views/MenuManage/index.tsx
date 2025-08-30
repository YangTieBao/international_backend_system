import NavBar from '@/components/NavBar'
import List from './list'

export default function index() {
    const initialItems = [
        {
            key: 1,
            label: '菜单管理列表',
            children: <List />,
            closable: false
        },
    ]
    return (
        <NavBar initialItems={initialItems}></NavBar>
    )
}
