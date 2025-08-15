export const errors = () => {
    const routerError = (routerUrl: String, err: String) => {
        console.error(routerUrl + '出现错误,原因:' + err)
    }
    return { routerError }
}