import CollapseDetail from '@/Layout/CollapseDetail'
import { Col, Form, Input, InputNumber, Row, Select } from 'antd'
export default function index({ visible = false }: any) {

    const collapseItems = [
        {
            key: '1',
            label: '菜单详情',
            children: form(1, visible),
        }
    ] as any

    const buttonList = [
        {
            key: 1,
            prop: '取消',
            onClick: () => {
                
            }
        },
        {
            key: 2,
            prop: '确认',
            type: 'primary',
            disabled: visible,
            onClick: () => {

            }
        }
    ] as any

    return (
        <CollapseDetail collapseItems={collapseItems} buttonList={buttonList} />
    )
}


const form = (initForms: any, isEdit: boolean) => {

    const colLayout = {
        xs: 24,
        md: 12,
        lg: 8,
        xl: 8,
        xxl: 6
    }

    const onSubmit = (values: any) => {

    }

    return (
        <Form
            layout="vertical"
            size='small'
            initialValues={initForms}
            disabled={isEdit}
            onFinish={onSubmit}
            scrollToFirstError={true}
        >
            <Row gutter={32}>
                <Col {...colLayout}>
                    <Form.Item label="菜单名称" name='menuName'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col {...colLayout}>
                    <Form.Item label="菜单地址" name='menuPath'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col {...colLayout}>
                    <Form.Item label="菜单类型" name='menuType'>
                        <Select>
                            <Select.Option value={0}>父菜单</Select.Option>
                            <Select.Option value={1}>子菜单</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col {...colLayout}>
                    <Form.Item label="菜单级别" name='menuGrade'>
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col {...colLayout}>
                    <Form.Item label="父菜单" name='menuParent'>
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col {...colLayout}>
                    <Form.Item label="排序" name='menuSort'>
                        <InputNumber
                            style={{ width: '100%' }}
                            defaultValue={0}
                            controls
                            step={1}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
