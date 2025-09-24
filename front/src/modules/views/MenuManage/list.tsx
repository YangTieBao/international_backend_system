import ButtonList from '@/components/ButtonList';
import FormWrapper from '@/components/FormWrapper';
import TableView from '@/components/TableView';
import { format } from '@/utils';
import { Tooltip } from 'antd';
import { useState } from 'react';
import Edit from './edit';
import './index.scss';

interface ListProps {
    addTab: (value: any) => void;
    removeTab: (value: any) => void;
}
export default function index({ addTab, removeTab }: ListProps) {
    const { formatTime } = format()
    const [queryParams, setQueryParams] = useState([]) as any
    const operationButtons = [
        {
            key: 1,
            prop: '查看',
            type: 'link',
            onClick: () => {
                addTab({
                    key: 3,
                    label: '查看菜单',
                    children: <Edit visible={true} removeTab={() => removeTab(3)} />,
                    closable: true
                })
            }
        },
        {
            key: 2,
            prop: '编辑',
            type: 'link',
            onClick: () => {
                addTab({
                    key: 4,
                    label: '编辑菜单',
                    children: <Edit removeTab={() => removeTab(4)} />,
                    closable: true
                })
            }
        },
        {
            key: 3,
            prop: '删除',
            type: 'link',
            onClick: () => {
                console.log('删除操作')
            }
        }
    ] as any
    const buttonList = [
        {
            key: 1,
            prop: '新增',
            type: 'primary',
            onClick: () => {
                addTab({
                    key: 2,
                    label: '新增菜单',
                    children: <Edit removeTab={() => removeTab(2)} />,
                    closable: true
                })
            }
        },
    ] as any

    const initForms = [
        {
            key: 1,
            prop: 'menuName',
            label: '菜单名称',
            type: 'input',
            placeholder: '请输入'
        },
        {
            key: 2,
            prop: 'menuGrade',
            label: '菜单级别',
            type: 'select',
            options: [{
                label: '1级',
                value: 0
            }, {
                label: '2级',
                value: 1
            }, {
                label: '3级',
                value: 2
            }]
        },
        {
            key: 3,
            prop: 'menuPath',
            label: '菜单地址',
            type: 'input',
            placeholder: '请输入'
        },
        {
            key: 4,
            prop: 'menuDateRange',
            label: '创建时间',
            type: 'dateRange'
        }
    ]

    const tableHeader: any = [
        {
            title: '菜单名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '菜单级别',
            dataIndex: 'grade',
            key: 'grade',
            render: (value: any) => (
                textSelect(value)
            )
        },
        {
            title: '菜单路由',
            dataIndex: 'path',
            key: 'path',
            render: (value: any) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>)
        },
        {
            title: '创建时间',
            dataIndex: 'createdTime',
            key: 'createdTime',
            render: (value: any) => (
                <Tooltip placement="topLeft" title={formatTime(value)}>
                    {formatTime(value)}
                </Tooltip>)
        }, {
            title: '创建人',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        {
            title: '更新时间',
            dataIndex: 'updatedTime',
            key: 'updatedTime',
            render: (value: any) => (
                <Tooltip placement="topLeft" title={formatTime(value)}>
                    {formatTime(value)}
                </Tooltip>)
        }, {
            title: '更新人',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 150,
            ellipsis: false,
            render: () => (
                <ButtonList buttonList={operationButtons} />
            ),
        },
    ];

    const textSelect = (value: any) => {
        let text
        if (value == 0) {
            text = '1级'
        } else if (value == 1) {
            text = '2级'
        } else if (value == 2) {
            text = '3级'
        }
        return text
    }

    const getFormSearch = (values: any) => {
        setQueryParams(values)
    }

    return (
        <div className='list'>
            <FormWrapper initForms={initForms} getFormSearch={getFormSearch}></FormWrapper>
            <ButtonList buttonList={buttonList} height="32px" />
            <TableView
                tableHeader={tableHeader}
                queryParams={queryParams}
                url='/menus/menuTableData'
            ></TableView>
        </div>
    )
}
