// Returns the request string depending the route received
export const apiUrl = (path) => {
    if (!path.startsWith('/')) {
        path = `/${path}`
    }
    return `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}${path}`
}