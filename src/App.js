import { createContext, useReducer, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HIDE_LOADER, LOGIN, LOGOUT, REFRESH_TOKEN, SHOW_LOADER } from './action-types'
import Home from './pages/Home'
import './App.css'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'

export const AuthContext = createContext()

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')),
  role: localStorage.getItem('role'),
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  showingLoader: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('role', action.payload.user.role)
      localStorage.setItem('token', action.payload.user.token)
      localStorage.setItem('refreshToken', action.payload.user.refreshToken)
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.user.role,
        token: action.payload.user.token,
        refreshToken: action.payload.user.refreshToken
      }

    case REFRESH_TOKEN:
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken
      }

    case LOGOUT:
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        role: null,
        token: null,
        refreshToken: null
      }

    case SHOW_LOADER:
      return {
        ...state,
        showingLoader: true
      }

    case HIDE_LOADER:
      return {
        ...state,
        showingLoader: false
      }

    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')
    // If the user is loged in, dispatch the user data
    if (user && token) {
      dispatch({
        type: LOGIN,
        payload: {
          user,
          role,
          token
        }
      })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ state, dispatch }} >
      <div className="App">
        <p>Hi world!</p>
        <Routes>

          <Route path='/home' element={
            <Home />
          } />

          <Route path='/login' element={
            <Login />
          } />

          <Route path='/register' element={
            <Register />
          } />

        </Routes>
      </div>
    </AuthContext.Provider>
  )
}

export default App
