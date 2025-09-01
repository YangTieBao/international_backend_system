import { Table } from 'antd';
import tableView from './index.module.scss';

interface TableHeader {
    align?: string;
    className?: string;
    colSpan?: number;
    dataIndex?: string | string[];
    defaultFilteredValue?: string[];
    filterResetToDefaultFilteredValue?: boolean;
    defaultSortOrder?: string; // 'ascend' | 'descend'
    ellipsis?: boolean;
    fixed?: boolean | string;
    key?: number | string;
    width?: number | string;
    minWidth?: number | string;
    hidden?: boolean;
}

interface TableFrops {
    tableHeader: TableHeader[];
    url?: string;
    method?: string;
}

export default function index({ tableHeader }: TableFrops) {
    const tableHeaderAgain = tableHeader.map(item => {
        return {
            ...item,
            width: item.width || 10
        }
    }) as any


    const data: any[] = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '5',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '6',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '7',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '8',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '9',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '10',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '11',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '12',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
    ];
    const handleChange = () => {
        console.log('Various parameters');
    };

    return (
        <Table
            className={tableView.tableView}
            columns={tableHeaderAgain}
            dataSource={data}
            size="small"
            bordered={false}
            sticky={true}
            virtual={true}
            loading={false}
            pagination={false}
            scroll={{ x: 'max-content' }}
            onChange={handleChange}
        />
    );
}