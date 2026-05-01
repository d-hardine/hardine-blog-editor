const logout = (setUser) => {
    setUser(null)
    localStorage.removeItem('token')
}

export default logout