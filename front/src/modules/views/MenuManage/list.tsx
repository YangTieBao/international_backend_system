import FormWrapper from '@/components/FormWrapper';
import TableView from '@/components/TableView';
import './index.scss';

export default function index() {
    const initForms = [
        {
            key: 1,
            label: '111111',
            type: 'input',
            placeholder: '请输入'
        },
        {
            key: 2,
            label: '2222',
            type: 'search'
        },
        {
            key: 3,
            label: '3333',
            type: 'select',
            options: [{
                label: '11111',
                value: 1
            }]
        },
        {
            key: 4,
            label: '44444',
            type: 'multipleSelect',
            options: [
                {
                    label: '1',
                    value: 1
                },
                {
                    label: '2',
                    value: 2
                },
                {
                    label: '3',
                    value: 3
                },
            ]
        },
        {
            key: 5,
            label: '55555',
            type: 'date',
        },
        {
            key: 6,
            label: '66666',
            type: 'datetime',
        },
        {
            key: 7,
            label: 'week',
            type: 'week',
        },
        {
            key: 8,
            label: 'month',
            type: 'month',
        },
        {
            key: 9,
            label: 'year',
            type: 'year',
        },
        {
            key: 10,
            label: 'dateRange',
            type: 'dateRange',
        },
        {
            key: 11,
            label: 'datetimeRange11111111231232',
            type: 'datetimeRange',
        },
        {
            key: 12,
            label: 'weekRange',
            type: 'weekRange',
        },
        {
            key: 13,
            label: 'monthRange',
            type: 'monthRange',
        },
        {
            key: 14,
            label: 'yearRange',
            type: 'yearRange',
        },

    ]

    const tableHeader: any = [
        {
            title: '菜单名称',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '菜单级别',
            dataIndex: 'grade',
            key: 'grade',
            ellipsis: true,
        },
        {
            title: '菜单路由',
            dataIndex: 'path',
            key: 'path',
            ellipsis: true,
        },

    ];
    return (
        <div className='list'>
            <FormWrapper initForms={initForms}></FormWrapper>
            <TableView
                tableHeader={tableHeader}
                url='/menus/menuTableData'
            ></TableView>
        </div>
    )
}
