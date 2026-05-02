import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import BlogEditor from "./pages/BlogEditor"
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import UserContext from './configs/UserContext'
import ProtectedRoutes from './configs/ProtectedRoutes'

function App() {

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <UserContext.Provider value={{user, setUser}}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoutes  isLoading={isLoading} setIsLoading={setIsLoading} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<BlogEditor />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
