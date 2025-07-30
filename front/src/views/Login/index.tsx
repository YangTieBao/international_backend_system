import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersRequests } from '@/api/users';
import { encrypt_decrypt } from '@/utils/crypto';
import loginStyle from './index.module.scss';


export default function index() {
    const { loginEncrypt, loginDecrypt } = encrypt_decrypt()
    const { login } = usersRequests()
    const navigate = useNavigate()

    interface loginType {
        username: string;
        password: string;
        remember?: boolean;
        autoLogin?: boolean;
    }

    useEffect(() => {
        const storedStates = getStoredStates() || {}
        const shouldAutoLogin = storedStates.autoLogin
            && storedStates.remember
            && storedStates.username
            && storedStates.password;

        if (shouldAutoLogin) {
            const response = login({
                username: storedStates.username,
                password: storedStates.password
            })
        }
    }, []); // 空依赖数组：仅在组件挂载时执行一次

    const getStoredStates = (): Partial<loginType> => {
        const stored = localStorage.getItem('loginPreferences');
        let { remember, autoLogin, username, encryptPassword } = stored ? JSON.parse(stored) : {};
        if (stored) {
            return { remember, autoLogin, username, ...(remember && { password: loginDecrypt(encryptPassword) }) }
        }
        return { remember: false, autoLogin: false };
    };

    const rules = {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }]
    }

    const onFinish: FormProps<loginType>['onFinish'] = async (values) => {
        let { remember, autoLogin, username, password } = values;
        remember = autoLogin ? true : remember
        const toStore = {
            remember,
            autoLogin,
            username,
            ...(remember && { encryptPassword: loginEncrypt(password) })
        };
        localStorage.setItem('loginPreferences', JSON.stringify(toStore));
        const response = await login(values)
        console.log(response, values)
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
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={getStoredStates()}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<loginType>
                            name="username"
                            rules={rules.username}
                        >
                            <Input placeholder="用户名" />
                        </Form.Item>

                        <Form.Item<loginType>
                            name="password"
                            rules={rules.password}
                        >
                            <Input.Password placeholder="密码" />
                        </Form.Item>

                        <div className={loginStyle.checkbox}>
                            <Form.Item<loginType> name="remember" valuePropName="checked" label={null}>
                                <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                            <Form.Item<loginType> name="autoLogin" valuePropName="checked" label={null}>
                                <Checkbox>自动登录</Checkbox>
                            </Form.Item>
                        </div>

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
