import { Button } from 'antd';

import type { ButtonProps as AntdButtonProps } from 'antd';

// interface ButtonItem {
//     key?: string | number;
//     prop?: any;
//     type?: string; // primary | dashed | link | text | default
//     variant?: string; // outlined | dashed | solid | filled | text | link
//     color?: string; // default | primary | danger
//     danger?: boolean;
//     disabled?: boolean;
//     ghost?: boolean; // 幽灵属性，使按钮背景透明
//     href?: string; // 点击跳转的地址，指定此属性 button 的行为和 a 链接一致
//     target?: string; // 相当于 a 链接的 target 属性，href 存在时生效
//     htmlType?: string; //submit | reset | button
//     icon?: ReactNode;
//     iconPosition?: string; //设置按钮图标组件的位置 start | end
//     loading?: boolean;
//     shape?: string; // default | circle | round
//     size?: string; // large | middle | small
//     onClick: () => void;
// }

interface ButtonItem extends AntdButtonProps {
    prop?: any;
    key?: string | number;
    onTableClick?: (row?: any, index?: number | string) => void;
}

interface ButtonProps {
    buttonList?: ButtonItem[];
    height?: string;
    align?: string;
    vAlign?: string;
    currentRow?: any;
    currentRowIndex?: number | string;
}

export default function index({ buttonList = [], currentRow, currentRowIndex, height = 'auto', align = 'left', vAlign = 'center' }: ButtonProps) {
    const isTableClick = (item: any) => {
        if (item.onTableClick) {
            if (currentRow) {
                (currentRowIndex || currentRowIndex == 0) ? item.onTableClick(currentRow, currentRowIndex) : item.onTableClick(currentRow)
            } else {
                item.onTableClick()
            }
        }

        if (item.onClick) {
            item.onClick()
        }
    }
    return (
        <div style={{ height: height, display: 'flex', alignItems: vAlign, justifyContent: align }}>
            {
                buttonList?.map(item => (
                    <Button key={item.key || item.prop} {...item} onClick={() => isTableClick(item)} style={{ marginRight: '8px' }}>{item.prop}</Button>
                ))
            }
        </div>
    );
}


