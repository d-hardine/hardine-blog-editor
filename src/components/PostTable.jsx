import Table from "react-bootstrap/Table"
import { format } from "date-fns"

function PostTable({allPosts}) {
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
              <td>{post.published.toString()}</td>
          </tr>
          ))}
        </tbody>
            </Table>
    </>
  )
}

export default PostTable