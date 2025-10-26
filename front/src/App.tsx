import AIDeepseek from '@/AI-deepseek';
import { ConfigProvider, message } from 'antd';
import { useState } from 'react';
import { I18nextProvider } from 'react-i18next'; // 引入原生提供者
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import './App.scss';
import i18n from './i18n'; // 导入 i18n 配置
import Router from "./router";
import { store } from './store'; // 导入创建的 store

function App() {
  const [, contextHolder] = message.useMessage();
  const [isOpenAi, setIsOpenAi] = useState(false)
  const clickDeepSeek = () => {
    setIsOpenAi(!isOpenAi)
  }
  return (
    <div id="backgroundSystem">
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ConfigProvider>
            {contextHolder}
            <BrowserRouter>
              <Router />
              {
                isOpenAi ? null : <div className='deepseek' onClick={clickDeepSeek}></div>
              }
              <AIDeepseek isOpenAi={isOpenAi} isOpenAiFn={clickDeepSeek}></AIDeepseek>
            </BrowserRouter>
          </ConfigProvider>
        </Provider>
      </I18nextProvider>
    </div>
  );
}

export default App;