import { DownOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    Row,
    Select,
    Space
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

    const formItemType = (type: string, placeholder?: any, options?: OptionItem[], onSearch?: () => void) => {
        let result = null

        if (type === 'text') {
            // 文本输入框
            result = <Input placeholder={placeholder} />
        } else if (type === 'search') {
            // 搜索框
            result = <Search placeholder={placeholder} onSearch={onSearch} />
        } else if (type === 'select') {
            // 选择框
            result = <Select placeholder={placeholder} options={options} />
        } else if (type === 'multipleSelect') {
            // 多个选择框
            result = <Select mode="multiple" placeholder={placeholder} options={options} maxTagCount='responsive' />
        } else if (type === 'date') {
            // 日期选择
            result = <DatePicker placeholder={placeholder} />
        } else if (type === 'datetime') {
            // 时间选择
            result = <DatePicker placeholder={placeholder} showTime />
        } else if (type === 'week') {
            // 周期选择
            result = <DatePicker placeholder={placeholder} picker="week" />
        } else if (type === 'month') {
            // 月份选择
            result = <DatePicker placeholder={placeholder} picker="month" />
        } else if (type === 'quarter') {
            // 季节选择
            <DatePicker placeholder={placeholder} picker="quarter" />
        } else if (type === 'year') {
            // 年份选择
            <DatePicker placeholder={placeholder} picker="year" />
        } else if (type === 'dateRange') {
            // 日期范围
            result = <RangePicker placeholder={placeholder} />
        } else if (type === 'datetimeRange') {
            // 时间范围
            result = <RangePicker placeholder={placeholder} showTime />
        } else if (type === 'weekRange') {
            // 周期范围
            result = <RangePicker placeholder={placeholder} picker="week" />
        } else if (type === 'monthRange') {
            // 月份范围
            result = <RangePicker placeholder={placeholder} picker="month" />
        } else if (type === 'quarterRange') {
            // 季节范围
            result = <RangePicker placeholder={placeholder} picker="quarter" />
        } else if (type === 'yearRange') {
            // 年份范围
            result = <RangePicker placeholder={placeholder} picker="year" />
        } else {
            result = <Input placeholder={placeholder} />
        }

        return result
    }

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Form
            form={form}
            name="advanced_search"
            size="small"
            className={search.form}
            onFinish={onFinish}>
            <Flex justify="space-between" align="flex-start" className={search.flex}>
                <Row gutter={24}>
                    {initFormsAgain.map(item => {
                        return (
                            <Col key={item.key} xs="24" md="24" lg="12" xl="8" xxl="6">
                                <Form.Item label={item.label}>
                                    {formItemType(item.type, item?.placeholder, item?.options, item?.onSearch)}
                                </Form.Item>
                            </Col>
                        )
                    })}
                </Row>
                <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            Clear
                        </Button>
                        <a
                            style={{ fontSize: 12 }}
                            onClick={() => {
                                setExpand(!expand);
                            }}
                        >
                            <DownOutlined rotate={expand ? 180 : 0} /> Collapse
                        </a>
                    </Space>
                </div>
            </Flex>
        </Form>
    );
};
