import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import loginStyle from './index.module.scss';
export default function index() {
    interface loginType {
        username?: string;
        password?: string;
        remember?: string;
    };

    const navigate = useNavigate()

    const rules = {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }]
    }

    const onFinish: FormProps<loginType>['onFinish'] = (values) => {
        if (values.username === 'admin' && values.password === 'admin123456') {
            navigate('/index/dashboard')
            sessionStorage.setItem('userInfo', JSON.stringify({ role: 'admin', token: '33333' }))
        }
    };

    const onFinishFailed: FormProps<loginType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div id={loginStyle.login}>
            <main className={loginStyle.main}>
                <header className={loginStyle.header}>
                    欢迎来到国际化后台管理系统！
                </header>
                <section className={loginStyle.section}>
                    <Form
                        name={loginStyle.form}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: false }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<loginType>
                            label="用户名"
                            name="username"
                            rules={rules.username}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<loginType>
                            label="密码"
                            name="password"
                            rules={rules.password}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<loginType> name="remember" valuePropName="checked" label={null}>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </main>
        </div>
    )
}
