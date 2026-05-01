import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link, useNavigate } from "react-router-dom"
import UserContext from "../configs/UserContext"
import { useContext } from "react"
import logout from "../configs/logout"
import './NavigationBar.css'

function NavigationBar() {

  const { user, setUser } = useContext(UserContext)

  const navigate = useNavigate()

  const handleLogout = () => {
    logout(setUser)
    navigate('/')
  }

  return (
    <Navbar expand="lg" className="navbar-background-color-light">
      <Container>
        <Navbar.Brand as={Link} to={'/'}>Hardine Blog Editor</Navbar.Brand>
        <Navbar.Toggle aria-controls="account-navbar-nav" />
        <Navbar.Collapse id="account-navbar-nav">
          <Nav className="ms-auto navbar-right-side">  {/* Use ms-auto to push items to the end */}
            <NavDropdown title={user.name} id="account-nav-dropdown">
              <NavDropdown.Item onClick={handleLogout}>LOG OUT</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar