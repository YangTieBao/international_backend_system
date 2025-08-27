import { Flex, Tag } from 'antd';
import navbar from './index.module.scss';
export default function index() {
    return (
        <Flex wrap={false} className={navbar.navbar}>
            <Tag bordered={false} className={navbar.actived}>Tag 1</Tag>
            <Tag bordered={false} closable>
                Tag 3
            </Tag>
        </Flex>
    )
}
