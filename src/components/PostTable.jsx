import api from "../configs/api"
import Table from "react-bootstrap/Table"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button"
import { format } from "date-fns"
import DeletePostModal from "./DeletePostModal"
import UserContext from "../configs/UserContext"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import trashIcon from '../assets/trash-icon.svg'

function PostTable({ allPosts, setAllPosts }) {

  const { user } = useContext(UserContext)

  const [show, setShow] = useState(false)
  const [pickedPost, setPickedPost] = useState('')
  const [isDeletingPost, setIsDeletingPost] = useState(false)

  const togglePublish = async (postId) => {
    const updatedPosts = allPosts.map(post => {
      if(post.id !== postId) {
        return post
      } else {
        return {...post, isPublished: !post.isPublished}
      }
    })
    setAllPosts(updatedPosts)
    try {
      await api.put(`/publish/${postId}`)
    } catch(err) {
      console.error(err)
    }
  }

  const showDeleteModal = (post) => {
    setShow(true)
    setPickedPost(post)
  }

  const cancelDeletePost = () => {
    setShow(false)
    setPickedPost('')
  }
  const confirmDeletePost = async (postId) => {
    try {
      setIsDeletingPost(true)
      const deleteResponse = await api.delete(`post/${postId}`)
      if(deleteResponse.status === 200) {
        console.log(deleteResponse.data)
        setShow(false)
        setAllPosts(allPosts.filter(p => p.id !== postId))
      }
    } catch(err) {
      console.error(err)
    } finally {
      setIsDeletingPost(false)
    }
  }

  return (
    <>
      <Table striped hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Post Title</th>
            <th>Author</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Published</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {allPosts.map((post, i) => (
            <tr key={post.id}>
              <td>{i + 1}</td>
              <td><Link to={`/preview/${post.id}`}>{post.title}</Link></td>
              <td>{post.author.name}</td>
              <td title={post.createdAt}>{format(post.createdAt, 'yyyy-MM-dd h:mm a')}</td>
              {post.createdAt === post.updatedAt ? (
                <td className="text-center">-</td>
              ) : (
                <td title={post.updatedAt}>{format(post.updatedAt, 'yyyy-MM-dd h:mm a')}</td>
              )}
              <td className="text-center">
                <Form>
                    <Form.Check
                      type="switch"
                      onChange={() => togglePublish(post.id)}
                      id='publish-post-switch'
                      checked={post.isPublished}
                      disabled={post.authorId !== user.sub ? true : false}
                    />
                </Form>
              </td>
              <td className="text-center">
                <Button
                  variant="danger"
                  disabled={post.authorId !== user.sub ? true : false}
                  onClick={() => showDeleteModal(post)} size="sm"
                >
                  <Image src={trashIcon} width={20} />
                </Button>
              </td>
          </tr>
          ))}
        </tbody>
      </Table>
      <DeletePostModal show={show} post={pickedPost} cancelDeletePost={cancelDeletePost} confirmDeletePost={confirmDeletePost} isDeletingPost={isDeletingPost}/>
    </>
  )
}

export default PostTable