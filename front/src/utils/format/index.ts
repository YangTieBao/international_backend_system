import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const format = () => {
    const formatDate = (date: string | number | Date | Dayjs) => {
        return dayjs(date).format('YYYY-MM-DD')
    }

    const formatTime = (date: string | number | Date | Dayjs) => {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    }

    return {
        formatDate,
        formatTime
    }
}