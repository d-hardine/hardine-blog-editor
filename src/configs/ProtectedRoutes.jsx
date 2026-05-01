import api from "./api"
import { Outlet, useLocation, Navigate } from "react-router-dom"
import { useEffect, useContext } from "react"
import Spinner from 'react-bootstrap/Spinner'
import { jwtDecode } from "jwt-decode"
import logout from "./logout"
import UserContext from "./UserContext"

function ProtectedRoutes({ isLoading, setIsLoading }) {

  const location = useLocation()

  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    const auth = async (setUser) => {
      try {
        const authResponse = await api.get('/auth')
        if(authResponse.status === 200) {
          const token = localStorage.getItem('token')
          setUser(jwtDecode(token))
        }
      } catch(error) {
        console.error(error)
        console.log(`you're not authenticated`)
        logout(setUser)
      } finally {
        setIsLoading(false)
      }
    }
    auth(setUser)
  }, [location.pathname])

  if (isLoading) return ( <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}><Spinner animation="grow" variant="secondary" /></div>)
    else if (!user) {
      return <Navigate to="/" replace />
  } else {
      return <Outlet />
  }
}

export default ProtectedRoutes