import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

const postButtonStyle = { width: "200px", height: "55px" };
function CommentEditor(props) {
  const [comment, setComment] = useState("");
  const onPostCommit = () => {
    if (!comment) return;
    if (props.onPost) {
      props.onPost(comment);
      setComment("");
    }
  };
  return (
    <div className="comment-editor">
      <h3 className="mb-4">READ & WRITE COMMENTS</h3>
      {/* <p className={isLoggedIn ? "count-comments" : "count-comments-relative"}> */}
      <p className={"count-comments"}>{props.total} Comments</p>
      <Form.Control
        as="textarea"
        placeholder="Leave a Comment"
        rows="5"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {props.isPosting ? (
        <Button className="mt-4 btn-bns">
          <Spinner animation="border" variant="dark" />
        </Button>
      ) : (
        <Button
          className="mt-4 btn-bns postButtonStyle"
          style={postButtonStyle}
          variant="bns"
          onClick={onPostCommit}
        >
          Post Comment
        </Button>
      )}
    </div>
  );
}

export default CommentEditor;
