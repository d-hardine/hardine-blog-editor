import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

function DeletePostModal({ show, post, cancelDeletePost, confirmDeletePost }) {

  return (
    <Modal show={show} centered onHide={cancelDeletePost}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Post Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'justify' }}>
        <p>You're about to delete a post titled "<b>{post.title}</b>".</p>
        <p>The post and it's comment history will be permanently deleted. Simply unpublish your post might be suffice. Continue?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelDeletePost}>
          Close
        </Button>
        <Button variant="danger" onClick={() => confirmDeletePost(post.id)}>
          Delete Post
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeletePostModal