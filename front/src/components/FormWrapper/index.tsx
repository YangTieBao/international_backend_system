import { DownOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    Row,
    Select
} from 'antd';
import { useState } from 'react';
import search from './index.module.scss';

const { RangePicker } = DatePicker;
const { Search } = Input;

interface OptionItem {
    label: number | string,
    value: number | string,
    emoji?: number | string,
    desc?: number | string,
}

interface FormItem {
    key: number | string;
    label: string;
    type?: string;
    options?: OptionItem[];
    placeholder?: string | [string, string];
    allowClear?: boolean;
    onSearch?: () => void;
}

interface FromProps {
    initForms: FormItem[];
}

export default function index({ initForms }: FromProps) {
    const initFormsAgain = initForms.map(item => {
        return {
            ...item,
            type: item.type || 'text',
            allowClear: item.allowClear || true
        }
    })
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);

    const changeExpand = () => {
        const isExpand = !expand
        setExpand(isExpand)
    }

    const formItemType = (item: FormItem) => {
        const { type, placeholder, allowClear, options, onSearch } = item as any
        let result = null

        if (type === 'text') {
            // 文本输入框
            result = <Input placeholder={placeholder} allowClear={allowClear} />
        } else if (type === 'search') {
            // 搜索框
            result = <Search placeholder={placeholder} onSearch={onSearch} allowClear={allowClear} />
        } else if (type === 'select') {
            // 选择框
            result = <Select placeholder={placeholder} options={options} allowClear={allowClear} />
        } else if (type === 'multipleSelect') {
            // 多个选择框
            result = <Select mode="multiple" placeholder={placeholder} options={options} maxTagCount='responsive' allowClear={allowClear} />
        } else if (type === 'date') {
            // 日期选择
            result = <DatePicker placeholder={placeholder} allowClear={allowClear} />
        } else if (type === 'datetime') {
            // 时间选择
            result = <DatePicker placeholder={placeholder} showTime allowClear={allowClear} />
        } else if (type === 'week') {
            // 周期选择
            result = <DatePicker placeholder={placeholder} picker="week" allowClear={allowClear} />
        } else if (type === 'month') {
            // 月份选择
            result = <DatePicker placeholder={placeholder} picker="month" allowClear={allowClear} />
        } else if (type === 'quarter') {
            // 季节选择
            result = <DatePicker placeholder={placeholder} picker="quarter" allowClear={allowClear} />
        } else if (type === 'year') {
            // 年份选择
            result = <DatePicker placeholder={placeholder} picker="year" allowClear={allowClear} />
        } else if (type === 'dateRange') {
            // 日期范围
            result = <RangePicker placeholder={placeholder} allowClear={allowClear} />
        } else if (type === 'datetimeRange') {
            // 时间范围
            result = <RangePicker placeholder={placeholder} showTime allowClear={allowClear} />
        } else if (type === 'weekRange') {
            // 周期范围
            result = <RangePicker placeholder={placeholder} picker="week" allowClear={allowClear} />
        } else if (type === 'monthRange') {
            // 月份范围
            result = <RangePicker placeholder={placeholder} picker="month" allowClear={allowClear} />
        } else if (type === 'quarterRange') {
            // 季节范围
            result = <RangePicker placeholder={placeholder} picker="quarter" allowClear={allowClear} />
        } else if (type === 'yearRange') {
            // 年份范围
            result = <RangePicker placeholder={placeholder} picker="year" allowClear={allowClear} />
        } else {
            result = <Input placeholder={placeholder} allowClear={allowClear} />
        }

        return result
    }

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Form
            form={form}
            name="search"
            size="small"
            className={search.form}
            onFinish={onFinish}>
            <Flex justify="space-between" align="flex-start" className={search.flex}>
                <Row gutter={12} className={`${search.row} ${expand ? search.autoHeight : ''}`}>
                    {initFormsAgain.map(item => {
                        return (
                            <Col key={item.key} xs={24} md={12} lg={8} xl={8} xxl={6}>
                                <Form.Item label={item.label} name={item.key}>
                                    {formItemType(item)}
                                </Form.Item>
                            </Col>
                        )
                    })}
                </Row>
                <div className={search.btns}>
                    <Button type="primary" htmlType="submit">
                        搜索
                    </Button>
                    <Button
                        className={search.reset}
                        onClick={() => {
                            form.resetFields();
                        }}
                    >
                        重置
                    </Button>
                    {initFormsAgain?.length > 6 ? <div className={search.expand} onClick={changeExpand}>
                        <span>展开</span>
                        <DownOutlined />
                    </div> : null}
                </div>
            </Flex>
        </Form>
    );
};
