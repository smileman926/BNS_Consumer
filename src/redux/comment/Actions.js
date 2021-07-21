import commentActionsTypes from './Types'

const postCommentRequest = (payload) => ({ type: commentActionsTypes.COMMENT_POST_REQUEST, payload });
const postCommentSuccess = (payload) => ({ type: commentActionsTypes.COMMENT_POST_SUCCESS, payload });
const postCommentFailed = (payload) => ({ type: commentActionsTypes.COMMENT_POST_FAILED, payload });

const getCommentsWithProductRequest = (payload) => ({ type: commentActionsTypes.COMMENT_WITH_PRODUCT_REQUEST, payload });
const getCommentsWithProductSuccess = (payload) => ({ type: commentActionsTypes.COMMENT_WITH_PRODUCT_SUCCESS, payload });
const getCommentsWithProductFailed = (payload) => ({ type: commentActionsTypes.COMMENT_WITH_PRODUCT_FAILED, payload });

const getCommentsWithUserRequest = (payload) => ({ type: commentActionsTypes.COMMENT_WITH_USER_REQUEST, payload });
const getCommentsWithUserSuccess = (payload) => ({ type: commentActionsTypes.COMMENT_WITH_USER_SUCCESS, payload });
const getCommentsWithUserFailed = (payload) => ({ type: commentActionsTypes.COMMENT_WITH_USER_FAILED, payload });

const commentActions = {
  postCommentRequest,
  postCommentSuccess,
  postCommentFailed,

  getCommentsWithProductRequest,
  getCommentsWithProductSuccess,
  getCommentsWithProductFailed,

  getCommentsWithUserRequest,
  getCommentsWithUserSuccess,
  getCommentsWithUserFailed
};

export default commentActions;
