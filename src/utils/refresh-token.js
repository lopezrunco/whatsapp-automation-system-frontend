import { LOGOUT, REFRESH_TOKEN } from "../action-types"
import { apiUrl } from "./api-url"

export const refreshToken = (token, dispatch, navigate, callback) => {
    fetch(apiUrl('auth/refresh'), {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw response
        }
    }).then(response => {
        dispatch({
            type: REFRESH_TOKEN,
            payload: response
        })
        // This is a callback function to reuse the code in different contexts. It will only apply if it comes as parameter
        if (callback) {
            callback()
        }
    }).catch(error => {
        console.error(error)
        dispatch({
            type: LOGOUT
        })
        navigate('/login')
    })
}