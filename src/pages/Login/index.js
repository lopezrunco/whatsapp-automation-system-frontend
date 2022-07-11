import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../App"
import { LOGIN } from "../../action-types"
import { apiUrl } from '../../utils/api-url'

function Login() {
    const { dispatch } = useContext(AuthContext)
    const navigate = useNavigate()
    const initialState = {
        email: '',
        password: '',
        token: '',
        isSubmitting: false,
        errorMessage: null
    }
    const [data, setData] = useState(initialState)

    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const handleFormSubmit = () => {
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        })
        fetch(apiUrl('login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                token: data.token
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw response
            }
        }).then(data => {
            dispatch({
                type: LOGIN,
                payload: data
            })
            navigate('/home')
        }).catch(error => {
            console.error(error)
            setData({
                ...data,
                isSubmitting: false,
                errorMessage: 'Credenciales inválidas'
            })
        })
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h2>Login</h2>
                </div>
            </div>
            <label htmlFor='email'>
                Email
                <input
                    type='text'
                    value={data.email}
                    onChange={handleInputChange}
                    name='email'
                    id='email'
                />
            </label>
            <label htmlFor='password'>
                Contraseña
                <input
                    type='password'
                    value={data.password}
                    onChange={handleInputChange}
                    name='password'
                    id='password'
                />
            </label>

            <button onClick={handleFormSubmit} disabled={data.isSubmitting}>
                {data.isSubmitting ? ('Espere...') : ('Iniciar sesión')}
            </button>
            {data.errorMessage && (<span>{data.errorMessage}</span>)}
            <div>
                <p>¿Aún no tienes una cuenta? <Link to='/register'>Regístrate</Link></p>
                <Link to='/'>Volver a Inicio</Link>
            </div>
        </div>
    )
}

export default Login