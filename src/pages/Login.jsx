import api from '../configs/api'
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import Alert from "react-bootstrap/Alert"
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Container>
        <Row className="align-items-center justify-content-center" style={{height: '100vh'}}>
          <Col className="col-md-6">
            <Form>
              <h2 className="mb-5"><b>LOG IN TO HARDINE BLOG EDITOR</b></h2>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
              </Form.Group>
              <Button type="submit" disabled={isLoading}>Login</Button>
              {isLoading && (<Spinner className="mx-3" animation="grow" variant="secondary" size="sm" />)}
            </Form>
            <div className=" mb-3 text-muted">Don't have an account? <Link to="/signup"><b>Signup</b></Link></div>
            {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>Login invalid</Alert>}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Login