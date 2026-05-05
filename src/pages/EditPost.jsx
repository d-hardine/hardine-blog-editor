import api from "../configs/api"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import Alert from "react-bootstrap/Alert"
import NavigationBar from "../components/NavigationBar"
import { useContext, useEffect, useState, useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
import UserContext from "../configs/UserContext"
import { useParams, Link, useNavigate } from "react-router-dom"
import imagePlus from '../assets/image-plus.svg'

function EditPost() {

  const { user } = useContext(UserContext)

  const params = useParams()

  const navigate = useNavigate()

  const [post, setPost] = useState()
  const [isPostLoading, setIsPostLoading] = useState(true)

  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [allTags, setAllTags] = useState()
  const [selectedTags, setSelectedTags] = useState([])
  const [preview, setPreview] = useState(null)
  const [newPostImage, setNewPostImage] = useState(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const editorRef = useRef(null) //tinyMCE stuff
  const fileInputRef = useRef(null) //for image preview

  useEffect(() => {
    const retrievePost = async () => {
      try {
        const retrieveResponse = await api.get(`/post/${params.postId}`)
        if (retrieveResponse.status === 200) {
          setPost(retrieveResponse.data.post)
          setNewTitle(retrieveResponse.data.post.title)
          setNewSubtitle(retrieveResponse.data.post.subtitle)
          setSelectedTags(retrieveResponse.data.post.tags.map(tag => tag.name))
          setPreview(retrieveResponse.data.post.postPicture)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsPostLoading(false)
      }
    }

    const retrieveTags = async () => {
      try {
        const retrieveResponse = await api.get('/all-tags')
        if (retrieveResponse.status === 200) {
          setAllTags(retrieveResponse.data.allTags)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    retrievePost()
    retrieveTags()
  }, [])

  const toggleSelectedTag = (tagName) => {
    setSelectedTags(prev => prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName])
  }

  // Function to handle the custom button click
  const handleClick = () => {
    // Trigger the click event of the hidden file input
    fileInputRef.current.click()
  }

  const handleChange = (e) => {
    const files = e.target.files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] //Client-side validation: Check MIME type

    if (files && files.length > 0) {
      if (!allowedTypes.includes(files[0].type)) { //if chosen file isn't an image
        setShowAlert(true)
        setAlertMessage('Only image files are allowed!')
      } else if (files[0].size > 1048576) {
        setShowAlert(true)
        setAlertMessage('Image size must not exceed 1MB!')
      } else {
        setNewPostImage(files[0])
        setPreview(URL.createObjectURL(files[0]))
      }
    }
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault()
    if(selectedTags.length <= 2) {
      setShowAlert(true)
      setAlertMessage('Pick at least 3 tags!')
      return
    }
    try {
      setIsPosting(true)
      const formData = new FormData()
      formData.append("title", newTitle)
      formData.append("subtitle", newSubtitle)
      formData.append("tags", selectedTags)
      formData.append("image", newPostImage)
      formData.append("content", editorRef.current.getContent())

      const updateResponse = await api.put(`/post/${params.postId}`, formData)
      if (updateResponse.status === 200)
        //console.log(updateResponse)
        navigate('/dashboard')
    } catch(err) {
      console.log(err)
    } finally {
      setIsPosting(false)
    }
  }

  if(!isLoading && !isPostLoading) {
    if(post.authorId !== user.sub) {
      return (
        <>
          <NavigationBar />
          <Container>
            <Row>
              <Col>
                <div>You're not the author for this article</div>
                <Link to="/dashboard">Return to dashboard</Link>
              </Col>
            </Row>
          </Container>
        </>
      )
    }
    else {
      return (
        <>
          <NavigationBar />
          <Container>
            <Row>
              <Col>
                <Form onSubmit={handleSubmitPost} className="mt-3">

                  <Form.Group className="mb-3" controlId="formPostTitle">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="text" defaultValue={newTitle} onChange={(e) => setNewTitle(e.target.value)} required/>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPostSubtitle">
                    <Form.Label>Post Subtitle</Form.Label>
                    <Form.Control type="text" defaultValue={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} required/>
                  </Form.Group>

                  <Form.Label>Post Tags</Form.Label>
                  <div className="mb-3">
                    {allTags.map((tag) => (
                      <Form.Check key={tag.id} inline type="checkbox" id={tag.name} label={tag.name} checked={selectedTags.includes(tag.name)} onChange={() => toggleSelectedTag(tag.name)} />
                    ))}
                    <br />
                    <Form.Text muted>Pick at least 3 tags</Form.Text>
                  </div>

                  <Form.Group className="mb-3" controlId="formImageUpload">
                    <Form.Label>Post Image {`(click image below to upload)`}</Form.Label>
                    <br />
                    {/* The custom button that the user will click */}
                    <Image className="mt-3 mb-3" src={imagePlus} width={50} role="button" title="upload image" onClick={handleClick}/>
                    {/* The actual file input, which is hidden */}
                    <Form.Control type="file" ref={fileInputRef} onChange={handleChange} /*Hide the input visually but keep it accessible */ style={{ display: 'none' }} />
                    {newPostImage && (<Button className="ms-2" variant="secondary" size="sm" onClick={() => { setPreview(post.postPicture); setNewPostImage(null) }}>Revert Image</Button>)}
                    {preview && (
                      <>
                        <Image src={preview} rounded fluid />
                        <br />
                      </>
                    )}
                    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>
                  </Form.Group>

                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    onInit={ (_evt, editor) => editorRef.current = editor }
                    initialValue={post.content}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                  />
                  <Button disabled={isPosting} className="mt-3" type="submit" variant="success">UPDATE POST</Button>
                  {isPosting && (<Spinner className="mx-3 mt-3" animation="grow" variant="info" />)}
                </Form>
              </Col>
            </Row>
          </Container>
      </>
      )
    }
  }

}

export default EditPost