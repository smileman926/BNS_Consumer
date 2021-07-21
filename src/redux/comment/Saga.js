import { all, call, put, takeEvery } from "redux-saga/effects";
import {
  getCommentsWithProductApi,
  getCommentsWithUserApi,
  postCommentApi,
} from "utils/services/commentApi";
import commentActions from "./Actions";
import commentActionTypes from "./Types";

export function* fetchCommentsWithProduct() {
  yield takeEvery(commentActionTypes.COMMENT_WITH_PRODUCT_REQUEST, function* ({
    payload,
  }) {
    try {
      const comments = yield call(getCommentsWithProductApi, payload);
      const result = comments.data.result;
      yield put(commentActions.getCommentsWithProductSuccess({ data: result }));
    } catch (err) {
      yield put(commentActions.getCommentsWithProductFailed());
    }
  });
}

export function* fetchCommentsWithUser() {
  yield takeEvery(commentActionTypes.COMMENT_WITH_USER_REQUEST, function* ({
    payload,
  }) {
    try {
      const comments = yield call(getCommentsWithUserApi, payload);

      yield put(commentActions.getCommentsWithUserSuccess(comments));
    } catch (err) {
      yield put(commentActions.getCommentsWithUserFailed());
    }
  });
}

export function* postComment() {
  yield takeEvery(commentActionTypes.COMMENT_POST_REQUEST, function* ({
    payload,
  }) {
    try {
      const comments = yield call(postCommentApi, payload);
      yield put(commentActions.postCommentSuccess(comments));
      yield put(
        commentActions.getCommentsWithProductRequest(payload.product_id)
      );
    } catch (err) {
      yield put(commentActions.postCommentFailed());
    }
  });
}

export default function* commentSagas() {
  yield all([
    fetchCommentsWithProduct(),
    fetchCommentsWithUser(),
    postComment(),
  ]);
}
