import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import BlogEditor from "./pages/BlogEditor"
import Preview from './pages/Preview'
import EditPost from './pages/EditPost'
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
            <Route path="/preview/:postId" element={<Preview />} />
            <Route path="/edit-post/:postId" element={<EditPost />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
