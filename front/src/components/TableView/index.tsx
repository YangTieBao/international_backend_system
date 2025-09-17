import { tableRequests } from '@/api/index';
import { Pagination, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
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
    isTitleTooltip?: boolean;
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
    rowSelection?: any; // hideSelectAll(是否显示全选) => boolean(true/false)，type(类型) => 'radio' 与 'checkbox'
    queryParams?: any[];
    defaultPageSize?: number;
    defaultCurrent?: number;
    pageSizeOptions?: number[];
}

export default function index({ tableHeader, defaultPageSize = 15, defaultCurrent = 1, pageSizeOptions = [5, 10, 15, 30, 60, 120, 1500], rowSelection = {}, url, method = 'post', queryParams = [] }: TableFrops) {
    const tableRequest = tableRequests()
    const [tableData, setTableData] = useState([])
    const [total, setTotal] = useState(0)

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
            title: () => (item.isTitleTooltip ? <Tooltip
                title={item.title}
                placement="topLeft"
            >
                {item.title}
            </Tooltip> : item.title),
            width: item.width || 100,
            ellipsis: item.ellipsis || true,
            // render: (value: any) => (
            //     <Tooltip placement="topLeft" title={value}>
            //         {value}
            //     </Tooltip>)
        }
    }) as any


    useEffect(() => {
        fetchTableData()
    }, [queryParams])

    const fetchTableData = async () => {
        if (url) {
            const response = await tableRequest.fetchTableData(url, method, { pageSize: defaultPageSize, currentPage: defaultCurrent, ...queryParams })
            setTableData(response.data?.tableData)
            setTotal(response.data?.total)
        }
    }

    const handleChange = () => {
        console.log('Various parameters');
    };

    const changePage = async (currentPage: number, pageSize: number) => {
        if (url) {
            const response = await tableRequest.fetchTableData(url, method, { pageSize, currentPage, ...queryParams })
            setTableData(response.data?.tableData)
            setTotal(response.data?.total)
        }
    }

    return (
        <div className={tableView.table}>
            <Table
                className={tableView.tableView}
                columns={tableHeaderAgain}
                dataSource={tableData}
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
                total={total}
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