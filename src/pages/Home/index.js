import { createContext, useContext, useEffect, useReducer } from "react"
import { useNavigate } from "react-router-dom"
import { HIDE_LOADER, SHOW_LOADER } from "../../action-types"
import { AuthContext } from "../../App"
import { apiUrl } from "../../utils/api-url"
import { refreshToken } from '../../utils/refresh-token'
import { FETCH_LISTS_FAILURE, FETCH_LISTS_REQUEST, FETCH_LISTS_SUCCESS, LIST_DELETED } from './action-types'
import Card from "./components/Card"

export const ListsContext = createContext()

const initialState = {
    lists: [],
    isFetching: false,
    hasError: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case FETCH_LISTS_REQUEST:
            return {
                ...state,
                isFetching: true,
                hasError: false
            }
        case FETCH_LISTS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                lists: action.payload.lists
            }
        case FETCH_LISTS_FAILURE:
            return {
                ...state,
                isFetching: false,
                hasError: true
            }
        case LIST_DELETED:
            return {
                ...state,
                lists: state.lists.filter(list => list.id !== action.payload.id) // Indicates the list to delete
            }
        default:
            return state
    }
}

function Home() {
    const navigate = useNavigate()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (authState.token) { // Authentication is neccesary to fetch the lists
            authDispatch({
                type: SHOW_LOADER
            })
            dispatch({
                type: FETCH_LISTS_REQUEST
            })

            fetch(apiUrl('lists'), {
                headers: {
                    'Authorization': authState.token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw response
                }
            }).then(data => {
                dispatch({
                    type: FETCH_LISTS_SUCCESS,
                    payload: data
                })
            }).catch(error => {
                console.error('Error fetching the lists', error)
                if (error.status === 401) {
                    refreshToken(
                        authState.refreshToken,
                        authDispatch,
                        navigate
                    )
                } else if (error.status === 403) {
                    navigate('/forbidden')
                } else {
                    dispatch({
                        type: FETCH_LISTS_FAILURE
                    })
                }
            }).finally(() => {
                authDispatch({
                    type: HIDE_LOADER
                })
            })
        }
    }, [authDispatch, authState.token, authState.refreshToken, navigate])

    return (
        // All children elements of home have access to the lists context, specifically to the state and dispatch
        <ListsContext.Provider value={{ state, dispatch }}>
            <main className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h2>My tasks</h2>
                    </div>
                </div>
                <div id='lists-container' className='row'>
                    {state.isFetching ? (
                        <span>Cargando...</span>
                    ) : state.hasError ? (
                        <span>Ocurrió un error</span>
                    ) : (
                        <>
                            {state.lists.length > 0 ? (
                                state.lists.map(list => (
                                    <Card key={list.id} list={list} />
                                ))
                            ) : (
                                <span>No hay listas aún!</span>
                            )}
                        </>
                    )}
                </div>
                <button onClick={() => navigate('/lists/create')}>Crear lista</button>
            </main>
        </ListsContext.Provider>
    )
}

export default Home