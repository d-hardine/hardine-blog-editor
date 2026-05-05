import api from "../configs/api"
import NavigationBar from "../components/NavigationBar"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Spinner from "react-bootstrap/Spinner"
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button"
import { useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { formatRelative } from "date-fns"
import parse from "html-react-parser"
import { Link, useNavigate } from "react-router-dom"
import UserContext from "../configs/UserContext"

function Preview() {

  const { user } = useContext(UserContext)

  const params = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const retrievePost = async () => {
    try {
      const retrieveResponse = await api.get(`/post/${params.postId}`)
      if (retrieveResponse.status === 200) {
        setPost(retrieveResponse.data.post)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    retrievePost()
  }, [])

  return (
    <>
      <NavigationBar />
      <Container>
        {isLoading ? (<Spinner animation="border" variant="info" />) : (
          <>
          <Row className="pt-5">
            <Col className="mb-4">
              <h2 className="mb-5"><u>Post Preview</u></h2>
              <div className="article-tags d-flex gap-2">
                {post.tags.map(tag => (
                  <Link key={tag.id} className='text-decoration-none text-light'>
                    <span className="bg-primary bg-gradient p-1 small fw-bold">{tag.name}</span>
                  </Link>
                ))}
              </div>
              <h2 className="mt-3 fw-bold">{post.title}</h2>
              <h5 className="mt-2 fw-lighter text-secondary">{post.subtitle}</h5>
              <div className="fw-lighter">By {post.author.name}, {formatRelative(post.createdAt, new Date())}</div>
              <Image src={post.postPicture} className="object-fit-cover mt-3" width="100%" rounded />
              <div className="mt-3">
                {parse(post.content)}
              </div>
            </Col>
          </Row>
          <Button className="position-fixed bottom-0 end-0 m-5" size="lg" variant="success" disabled={post.authorId !== user.sub ? true : false} onClick={() => navigate(`/edit-post/${params.postId}`)}>Edit Post</Button>
          </>
        )}
      </Container>
    </>
  )
}

export default Preview