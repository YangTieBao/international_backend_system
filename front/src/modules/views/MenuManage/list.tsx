import FormWrapper from '@/components/FormWrapper';
import TableView from '@/components/TableView';
import list from './index.module.scss';

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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
            ellipsis: true,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            ellipsis: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            filters: [
                { text: 'London', value: 'London' },
                { text: 'New York', value: 'New York' },
            ],
            ellipsis: true,
        },

    ];
    return (
        <div className={list.list}>
            <FormWrapper initForms={initForms}></FormWrapper>
            <TableView
                tableHeader={tableHeader}
            ></TableView>
        </div>
    )
}
