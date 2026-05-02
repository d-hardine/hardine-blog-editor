import api from "../configs/api"
import Table from "react-bootstrap/Table"
import Form from "react-bootstrap/Form"
import { format } from "date-fns"
import UserContext from "../configs/UserContext"
import { useContext } from "react"

function PostTable({ allPosts, setAllPosts }) {

  const { user } = useContext(UserContext)

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
      const updateResponse = await api.put(`/publish/${postId}`)
    } catch(err) {
      console.error(err)
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
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {allPosts.map((post, i) => (
            <tr key={post.id}>
              <td>{i + 1}</td>
              <td>{post.title}</td>
              <td>{post.author.name}</td>
              <td>{format(post.createdAt, 'yyyy-MM-dd h:mm a')}</td>
              <td>{format(post.updatedAt, 'yyyy-MM-dd h:mm a')}</td>
              <td>
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
          </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={() => console.log(allPosts[0])}>testing</button>
    </>
  )
}

export default PostTable