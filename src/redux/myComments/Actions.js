import myCommentsTypes from "./Types";

const myCommentsRequest = (payload) => ({
  type: myCommentsTypes.MYCOMMENTS_REQUEST,
  payload,
});

const myCommentsSuccess = (payload) => ({
  type: myCommentsTypes.MYCOMMENTS_SUCCESS,
  payload,
});

const myCommentsFailed = (payload) => ({
  type: myCommentsTypes.MYCOMMENTS_FAILED,
  payload,
});

const myCommentsActions = {
  myCommentsRequest,
  myCommentsSuccess,
  myCommentsFailed,
};
export default myCommentsActions;
