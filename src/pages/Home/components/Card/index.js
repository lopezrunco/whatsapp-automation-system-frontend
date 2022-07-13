import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ListsContext } from "../.."
import { AuthContext } from "../../../../App"
import { apiUrl } from "../../../../utils/api-url"
import { refreshToken } from "../../../../utils/refresh-token"
import { LIST_DELETED } from "../../action-types"

function Card({ list }) {
    const navigate = useNavigate()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const { state: listState, dispatch: listsDispatch } = useContext(ListsContext)

    const viewList = () => {
        navigate(`/lists/${list.id}`)
    }

    const deleteList = () => {
        fetch(apiUrl(`/lists/${list.id}`), {
            method: 'DELETE',
            headers: {
                'Authorization': authState.token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                return
            } else {
                throw response
            }
        }).then(() => {
            alert('List deleted')
            listsDispatch({
                type: LIST_DELETED,
                payload: {
                    id: list.id // Update the home reducer, indicating the list to delete
                }
            })
        }).catch(error => {
            console.error('Error trying to delete the list', error)
            if (error.status === 401) {
                refreshToken(
                    authState.refreshToken,
                    authDispatch,
                    navigate,
                    () => deleteList
                )
            } else if (error.status === 403) {
                navigate('./forbidden')
            } else {
                alert('Error tratando de borrar la lista')
            }
        })
    }

    return (
        <div className="card">
            <h4>{list.title}</h4>
            <p>{list.description}</p>
            <button onClick={viewList}>View</button>
            <button onClick={deleteList}>Delete</button>
        </div>
    )
}

export default Card