import { usersRequests } from '@/api/users';
import { useLanguage } from '@/hooks/useLanguage';
import { loginSuccess } from '@/store';
import { messageFunctions } from '@/utils';
import { encrypt_decrypt } from '@/utils/crypto';
import {
    GlobalOutlined
} from '@ant-design/icons';
import type { FormProps, MenuProps } from 'antd';
import { Button, Checkbox, Dropdown, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import loginStyle from './index.module.scss';

export default function index() {
    const { t } = useTranslation()
    const { showSuccess } = messageFunctions()
    const { loginEncrypt, loginDecrypt } = encrypt_decrypt()
    const { login } = usersRequests()
    const { currentLanguage, languageSelectItems, initLanguage, changeLanguage } = useLanguage()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm<loginType>();
    const dispatch = useDispatch();

    interface loginType {
        username: string;
        password: string;
        remember?: boolean;
        autoLogin?: boolean;
    }

    useEffect(() => {
        autoLogin()
        initLanguage(true)
    }, []);

    const items: MenuProps['items'] = languageSelectItems ? languageSelectItems.map((lang: any) => ({
        key: lang.id,
        label: lang.native_name,
        onClick: () => {
            changeLanguage(lang.code, true)
        }
    })) : [];

    const currentLanguageItem = languageSelectItems ? (languageSelectItems).find(
        (lang: any) => lang.code == currentLanguage
    ) : null;

    const autoLogin = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const allLoginValues = await form.validateFields();
        const shouldAutoLogin = allLoginValues.autoLogin
            && allLoginValues.remember
            && allLoginValues.username
            && allLoginValues.password;

        if (shouldAutoLogin) {
            setLoading(true)
            login({
                username: allLoginValues.username,
                password: allLoginValues.password
            }).then((res) => {
                if (res.code === 200) {
                    setTimeout(() => {
                        setLoading(false)
                        showSuccess('登录成功')
                        dispatch(loginSuccess(res.data))
                        navigate('/dashboard', { replace: true })
                    }, 2000)
                } else {
                    setTimeout(() => {
                        setLoading(() => false)
                    }, 2000)
                }
            })
        }
    }

    const updateLoginValues = async () => {
        const allLoginValues = await form.validateFields();
        let { remember, autoLogin, username, password } = allLoginValues;
        remember = autoLogin ? true : remember
        const toStore = {
            remember,
            autoLogin,
            username,
            ...(remember && { encryptPassword: loginEncrypt(password) })
        };
        localStorage.setItem('loginPreferences', JSON.stringify(toStore));
    };

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
        setLoading(() => true)
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
        if (response.code === 200) {
            setTimeout(() => {
                setLoading(() => false)
                showSuccess('登录成功')
                dispatch(loginSuccess(response.data))
                navigate('/dashboard', { replace: true })
            }, 2000)
        } else {
            setTimeout(() => {
                setLoading(() => false)
            }, 2000)
        }
    };

    return (
        <div id={loginStyle.login}>
            <div className={loginStyle.top}>
                <h4>国际化管理平台</h4>
                <Dropdown menu={{ items }} placement="bottomLeft">
                    <div className={loginStyle.language}>
                        <GlobalOutlined />
                        <span className={loginStyle.languageName}>{currentLanguageItem?.native_name}</span>
                    </div>
                </Dropdown>
            </div>
            <div className={loginStyle.middle}>
                <main className={loginStyle.main}>
                    <header className={loginStyle.header}>
                        欢迎来到国际化管理平台！
                    </header>
                    <section className={loginStyle.section}>
                        <Form
                            name={loginStyle.form}
                            form={form}
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            initialValues={getStoredStates()}
                            onFinish={onFinish}
                            autoComplete="off"
                            onValuesChange={() => {
                                updateLoginValues();
                            }}
                        >
                            <Form.Item<loginType>
                                name="username"
                                rules={rules.username}
                            >
                                <Input placeholder={t('login.username')} />
                            </Form.Item>

                            <Form.Item<loginType>
                                name="password"
                                rules={rules.password}
                            >
                                <Input.Password placeholder={t('login.password')} />
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
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </main>
            </div>
            <div className={loginStyle.bottom}></div>
        </div>
    )
}
