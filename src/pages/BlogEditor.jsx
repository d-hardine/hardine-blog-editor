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
import { useState, useRef, useEffect } from "react"
import { Editor } from "@tinymce/tinymce-react"
import imagePlus from '../assets/image-plus.svg'
import { useNavigate } from "react-router-dom"

function BlogEditor() {

  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [allTags, setAllTags] = useState()
  const [selectedTags, setSelectedTags] = useState([])
  const [preview, setPreview] = useState(null)
  const [newPostImage, setNewPostImage] = useState(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const editorRef = useRef(null) //tinyMCE stuff
  const fileInputRef = useRef(null) //for image preview

  const navigate = useNavigate()

  useEffect(() => {
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
      const formData = new FormData()
      formData.append("title", newTitle)
      formData.append("subtitle", newSubtitle)
      formData.append("tags", selectedTags)
      formData.append("image", newPostImage)
      formData.append("content", editorRef.current.getContent())

      const postResponse = await api.post('/create-post', formData)
      if (postResponse.status === 200)
        //console.log(postResponse.data)
        navigate('/dashboard')
    } catch(err) {
      console.log(err.response.data)
      //console.log('kontol')
    }
  }
  
  return (
    <>
      <NavigationBar />
      <Container>
        <Row>
          <Col>
            {isLoading ? (<Spinner animation="border" variant="info" />) : (
              <>
                <Form onSubmit={handleSubmitPost} className="mt-3">

                  <Form.Group className="mb-3" controlId="formPostTitle">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="text" onChange={(e) => setNewTitle(e.target.value)} required/>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPostSubtitle">
                    <Form.Label>Post Subtitle</Form.Label>
                    <Form.Control type="text" onChange={(e) => setNewSubtitle(e.target.value)} required/>
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
                    {preview && (
                      <>
                        <Image src={preview} rounded fluid />
                        <br />
                      </>
                    )}
                    {/* The custom button that the user will click */}
                    <Image className="mt-3 mb-3" src={imagePlus} width={50} role="button" title="upload image" onClick={handleClick}/>
                    {/* The actual file input, which is hidden */}
                    <Form.Control type="file" ref={fileInputRef} onChange={handleChange} /*Hide the input visually but keep it accessible */ style={{ display: 'none' }} />
                    {newPostImage && (<Button className="ms-2" variant="secondary" size="sm" onClick={() => { setPreview(null); setNewPostImage(null) }}>Clear Image</Button>)}
                    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>
                  </Form.Group>

                  <Editor
                    apiKey='ngzhdqwricn8mcbxhzkr75nnxl1dusb0iwkclsa32jt2rmr7'
                    onInit={ (_evt, editor) => editorRef.current = editor }
                    initialValue="<p>Write your post content here :)</p>"
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
                  <Button className="mt-3" type="submit" variant="success">SUBMIT POST</Button>
                </Form>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default BlogEditor