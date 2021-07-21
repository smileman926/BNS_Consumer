import React from "react";
import * as style from "./SubComment.module.scss";
import Avatar from "./../Avatar";

function SubComment({ comment, formatDate }) {
  return (
    <div className={style.box}>
      <div className={style.picture_wrp}>
        <Avatar
          round
          size="40"
          name={comment.username}
          src={comment.profile_picture}
        />
      </div>
      <div className={style.content}>
        <p className={style.name}>{comment.username} </p>
        <p className={style.message}>{comment.comment_content}</p>
        <p className={style.date}>{formatDate(comment.createdAt)}</p>
      </div>
    </div>
  );
}

export default SubComment;
