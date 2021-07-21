/* eslint-disable react-hooks/exhaustive-deps */
import { faReply, faTimes, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createRef, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import routers from "router";
import Avatar from "./Avatar";
import * as style from "./MyCommentsCard.module.scss";
import SubComment from "./SubComment/SubComment";
import { useSelector } from "react-redux";
import { userSelector } from "@redux/auth/Selectors";
import { settingsSelector } from "@redux/settings/Selector";
import clsx from "clsx";

function MyCommentsCard({ comment, hasProduct = false, postCommentRequest, isLogin, user_id }) {
  const { message, product_status, childs } = comment;
  const user = useSelector(userSelector);
  const settings = useSelector(settingsSelector);
  const [readFull, setReadFull] = useState(false);
  const [cropMes, setCropMes] = useState(false);

  const message_ref = createRef();
  const message_box_ref = createRef();

  const [valueArea, setValueArea] = useState("");
  const isProgress = useSelector((state) => state.comment.isPosting);
  const stringContainsLineBreaks = message.comment_content.includes("\n");

  useEffect(() => {
    console.log('rerender')
    if (
      message_box_ref.current.offsetWidth < message_ref.current.offsetWidth ||
      childs.length > 0 ||
      stringContainsLineBreaks
    ) {
      setReadFull(false);
      setCropMes(false);
      message_ref.current.classList.add(style.hidden);
    } else {
      setReadFull(true);
      setCropMes(true);
    }
  }, [comment]);

  useEffect(() => {
    if (!readFull) message_ref.current.classList.add(style.hidden);
  }, [readFull]);

  const formatDate = (time) => {
    const date = new Date(time);
    const options = {
      hour12: true,
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString("en", options);
  };

  const goTo = () =>
    routers.product.path.replace(":id", message.product_id).replace(":type", message.product_type);

  const [showReplayForm, setShowReplayForm] = useState(false);

  const handlerReplayForm = () => {
    if (!showReplayForm) setReadFull(true);
    setShowReplayForm(!showReplayForm);
  };

  const showFullMessage = ({ currentTarget, target }) => {
    setReadFull(!readFull);
  };

  const sendNewComment = (event) => {
    event.preventDefault();

    const options = {
      user_id,
      product_id: message.product_id,
      parent_id: message.id,
      comment_content: valueArea,
      product_type: message.product_type,
    };

    postCommentRequest(options);
    setValueArea("");
  };

  const renderReplyButton = useMemo(() => {
    return (
      hasProduct &&
      isLogin && (
        <button className={style.replay_btn} onClick={handlerReplayForm}>
          <FontAwesomeIcon icon={showReplayForm ? faTimes : faReply} flip="horizontal" /> Reply
        </button>
      )
    );
  }, [hasProduct, isLogin]);

  return (
    <>
      <div className={style.comment_box}>
        {!hasProduct && product_status === "active" && (
          <Link to={goTo} className={style.link}>
            Go to Thread
          </Link>
        )}
        {settings?.commentsOption && user?.user_role !== "admin" ? null : renderReplyButton}
        <div className={style.avatar_wrp}>
          <Avatar round size="50" name={message.username} src={message.profile_picture} />
        </div>
        <div className={style.container}>
          <div onClick={showFullMessage}>
            <p className={style.name}>{message.username}</p>
            <p className={style.date}>{formatDate(message.createdAt)}</p>
            <div
              className={clsx(style.checkMessage, readFull && style.readFullCOnt)}
              ref={message_box_ref}
            >
              <div className={clsx(style.message, readFull && style.full)}>
                <span ref={message_ref}>
                  {message.comment_content}{" "}
                </span>
                {!readFull && !cropMes ? <span>...</span> : null}
              </div>
              {/* {readFull && !cropMes && (
                <span className={style.readFull}>&nbsp;Read less comment</span>
              )} */}
              {!readFull && !cropMes && (
                <span className={style.readFull}>&nbsp;Read full comment</span>
              )}
              {readFull && !cropMes && (
                    <span className={style.readFull}>&nbsp;Read less comment</span>
                  )}
            </div>  
          </div>
          <hr />
          {childs && childs.length === 0 && <p className="font-italic">No reply</p>}
          {!readFull && childs && childs.length > 0 && (
            <>
              {childs.map((el, i) =>
                i < 5 ? (
                  <Avatar
                    key={el.id}
                    size="40"
                    src={el.profile_picture}
                    className={style.subAuthor}
                    name={el.username}
                    round
                  />
                ) : null
              )}{" "}
              <span className={style.etcUser}>{childs[childs.length - 1].username}</span>
              {childs.length - 6 > 0 ? ` and ${childs.length - 6} more` : ""} replied
            </>
          )}
          {readFull &&
            childs &&
            childs.length > 0 &&
            childs.map((subComment) => (
              <SubComment comment={subComment} formatDate={formatDate} key={subComment.id} />
            ))}
          {showReplayForm && (
            <form className={style.replayComment} onSubmit={sendNewComment}>
              <textarea
                value={valueArea}
                onChange={({ target }) => setValueArea(target.value)}
                className={style.textArea}
                placeholder="Leave a Comment"
                rows="4"
              />
              <Button variant="bns" type="submit" disabled={isProgress}>
                {isProgress && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
                post comment
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default MyCommentsCard;
