import CollapseDetail from '@/Layout/CollapseDetail';
import { messageFunctions } from '@/utils';
import { menuManageRequests } from '@mod/api/menuManage';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
export default function index({ initFormItem, visible = false, removeTab }: any) {
    const { getParentMenus, save } = menuManageRequests()
    const { showSuccess, showError } = messageFunctions()
    const [form2] = Form.useForm()
    const [parentMenus, setParentMenus] = useState()
    const form = (initForms: any, isEdit: boolean) => {
        const [gradeValue, setGradeValue] = useState()

        const colLayout = {
            xs: 24,
            md: 12,
            lg: 8,
            xl: 8,
            xxl: 6
        }

        const rules = {
            title: [{ required: true, message: '请输入菜单名称' }],
            path: [{ required: true, message: '请输入菜单地址' }],
            grade: [{ required: true, message: '请输入菜单级别' }],
        }

        useEffect(() => {
            setGradeValue(form2.getFieldValue('grade'));
            if (form2.getFieldValue('grade')) {
                getParentMenus(form2.getFieldValue('grade')).then(res => {
                    const options = res.data.parentData.map((item, index) => {
                        return {
                            key: index + '-' + item.title + '-' + item.id,
                            label: item.title,
                            value: item.id
                        }
                    })
                    setParentMenus(options)
                })
            }
        }, [])

        const gradeChange = async (value: any) => {
            setGradeValue(value);
            if (value) {
                const response = await getParentMenus(value)
                if (response.code === 200) {
                    const options = response.data.parentData.map((item, index) => {
                        return {
                            key: index + '-' + item.title + '-' + item.id,
                            label: item.title,
                            value: item.id
                        }
                    })
                    setParentMenus(options)
                }
            }
        }

        return (
            <Form
                form={form2}
                layout="vertical"
                size='small'
                initialValues={initForms}
                disabled={isEdit}
                scrollToFirstError={true}
            >
                <Row gutter={32}>
                    <Col {...colLayout}>
                        <Form.Item label="菜单名称" name='title' rules={rules.title}>
                            <Input allowClear />
                        </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                        <Form.Item label="菜单地址" name='path' rules={rules.path}>
                            <Input allowClear />
                        </Form.Item>
                    </Col>
                    {/* <Col {...colLayout}>
                        <Form.Item label="菜单类型" name='type'>
                            <Select>
                                <Select.Option value={0}>父菜单</Select.Option>
                                <Select.Option value={1}>子菜单</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col> */}
                    <Col {...colLayout}>
                        <Form.Item label="菜单级别" name='grade' rules={rules.grade}>
                            <Select allowClear onChange={gradeChange}>
                                <Select.Option value={0} >一级</Select.Option>
                                <Select.Option value={1}>二级</Select.Option>
                                <Select.Option value={2}>三级</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {
                        gradeValue !== 0 ?
                            <Col {...colLayout}>
                                <Form.Item label="父菜单" name='parent_name'>
                                    <Select options={parentMenus} allowClear></Select>
                                </Form.Item>
                            </Col> : null
                    }
                    <Col {...colLayout}>
                        <Form.Item label="排序" name='sort'>
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

    // 提交表单
    const onSubmit = async (values: any) => {
        let parent_real_name
        if (values.parent_name) {
            parent_real_name = parentMenus.find(item => item.value === values.parent_name)
        }
        const editData = {
            ...values,
            parent_id: values.parent_name,
            parent_name: parent_real_name?.label || null
        }

        const res = await save(editData)
        if (res.code) {
            showSuccess()
            removeTab()
        } else {
            showError()
        }
    }

    const collapseItems = [
        {
            key: '1',
            label: '菜单详情',
            children: form(initFormItem, visible),
        }
    ] as any

    const buttonList = [
        {
            key: 1,
            prop: '取消',
            onClick: () => {
                removeTab()
            }
        },
        {
            key: 2,
            prop: '确认',
            type: 'primary',
            disabled: visible,
            onClick: async () => {
                await form2.validateFields();
                onSubmit(form2.getFieldValue())
            }
        }
    ] as any

    return (
        <CollapseDetail collapseItems={collapseItems} buttonList={buttonList} />
    )
}
