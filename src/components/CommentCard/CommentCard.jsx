import React from 'react'
import ReactAvatar from 'react-avatar'
import './CommentCard.style.scss'

function CommentCard(props) {
  const { comment } = props;
  return (
    <div className="comment-card d-flex mt-3 mb-3">
      <div>
        <ReactAvatar  size="50" name={comment.username} round />
      </div>
      <div className="ml-3 flex-grow-1 ">
        <div className="d-flex justify-content-between">
          <div>
            <div className="comment-card-user color-green font-weight-bold"> {comment.username}</div>
            <span className="comment-card-date"> May 31st 2019, 3:7am</span>
          </div>
          <div className="color-red font-weight-bold">
            Reply
          </div>
        </div>
        <div className="comment-card-content pt-3 pb-3">
          {comment.comment_content}
        </div>
        <div className="pt-3 comment-card-avatars">
          {
            comment.childs.map((item, index) =>{
              if (index >= 5) return ""
              return <ReactAvatar  size="40" name={item.username} round  />
            })
          }
          { comment.childs.length > 0 && <span className="pl-2"> Jenny, Robert and 13 more replyed</span> }
          { comment.childs.length == 0 && <span className=""> No reply</span> }
        </div>
      </div>
    </div>
  )
}

export default CommentCard

