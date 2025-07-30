import { ConfigProvider, message } from 'antd';
import { I18nextProvider } from 'react-i18next'; // 引入原生提供者
import { BrowserRouter } from "react-router-dom";
import './App.scss';
import i18n from './i18n'; // 导入 i18n 配置
import Router from "./router";

function App() {
  const [, contextHolder] = message.useMessage();
  return (
    <div id="backgroundSystem">
      <I18nextProvider i18n={i18n}>
        <ConfigProvider>
          {contextHolder}
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </ConfigProvider>
      </I18nextProvider>
    </div>
  );
}

export default App;