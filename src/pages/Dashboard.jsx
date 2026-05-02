import api from "../configs/api"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Spinner from "react-bootstrap/Spinner"
import NavigationBar from "../components/NavigationBar"
import PostTable from "../components/PostTable"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function Dashboard() {

  const [allPosts, setAllPosts] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const retrieveAllPosts = async () => {
      try {
        const retrieveResponse = await api.get('/all-posts')
        if (retrieveResponse.status === 200) {
          setAllPosts(retrieveResponse.data.allPosts)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    retrieveAllPosts()
  }, [])

  return (
    <>
      <NavigationBar />
      <Container>
        {isLoading ? (<Spinner animation="border" variant="info" />) : (
        <Row>
          <Col>
            <h2 className="mt-5 mb-5 fw-bold text-center">All Hardine-Blog Posts</h2>
            <PostTable allPosts={allPosts} setAllPosts={setAllPosts} />
            <Button className="position-fixed bottom-0 end-0 m-5" size="lg" variant="success" onClick={() => navigate('/editor')}>Create New Post</Button>
          </Col>
        </Row>
        )}
      </Container>
    </>
  )
}

export default Dashboard