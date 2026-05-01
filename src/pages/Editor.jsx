import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import NavigationBar from "../components/NavigationBar"

function Editor() {
  return (
    <>
      <NavigationBar />
      <Container>
        <Row>
          <Col>
            <div>editor page</div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Editor