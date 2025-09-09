import { Pagination, Table, Tooltip } from 'antd';
import tableView from './index.module.scss';

interface TableHeader {
    title?: any;
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
    minWidth?: number;
    hidden?: boolean;
    render?: any;
}

interface TableFrops {
    tableHeader: TableHeader[];
    url?: string;
    method?: string;
    rowSelection?: any; // hideSelectAll => 是否显示全选，type =>有radio与checkbox
    queryParams?: any[];
    defaultPageSize?: number;
    defaultCurrent?: number;
    pageSizeOptions?: number[];
}

export default function index({ tableHeader, defaultPageSize = 15, defaultCurrent = 1, pageSizeOptions = [15, 30, 60, 120, 1500], rowSelection = {}, queryParams = [] }: TableFrops) {
    const rowSelectionAgain = {
        hideSelectAll: rowSelection.hideSelectAll || false,
        type: rowSelection.type,
        columnWidth: 32
    }

    const tableHeaderPushIndex = [
        {
            title: '序列',
            dataIndex: 'key',
        },
        ...tableHeader
    ]
    const tableHeaderAgain = tableHeaderPushIndex.map(item => {
        if (item.dataIndex === 'key') {
            return {
                ...item,
                width: 40,
                fixed: true,
                align: 'center'
            }
        }
        return {
            ...item,
            title: () => (<Tooltip
                title={item.title}
                placement="topLeft"
            >
                {item.title}
            </Tooltip>),
            width: item.width || 100,
            ellipsis: item.ellipsis || true,
            render: (value: any) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>)
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

    const changePage = (pageSize: number, currentPage: number) => {
        
    }

    return (
        <div className={tableView.table}>
            <Table
                className={tableView.tableView}
                columns={tableHeaderAgain}
                dataSource={data}
                rowSelection={rowSelectionAgain.type ? rowSelectionAgain : undefined}
                tableLayout="fixed"
                size="small"
                bordered={false}
                sticky={true}
                virtual={true}
                loading={false}
                pagination={false}
                scroll={{ x: '100%' }}
                onChange={handleChange}
            />
            <Pagination
                className={tableView.pagination}
                pageSizeOptions={pageSizeOptions}
                total={850}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条数据`}
                defaultPageSize={defaultPageSize}
                defaultCurrent={defaultCurrent}
                onChange={changePage}
            />
        </div>
    );
}