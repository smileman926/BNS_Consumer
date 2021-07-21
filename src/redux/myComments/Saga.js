import { all, call, put, takeEvery } from "redux-saga/effects";
import myCommentsTypes from "./Types";
import myCommentsActions from "./Actions";
import { getMyCommentsApi } from "./../../utils/services/api";

export function* getMyComments() {
  yield takeEvery(myCommentsTypes.MYCOMMENTS_REQUEST, function* ({ payload }) {
    try {
      const comments = yield call(getMyCommentsApi, payload);
      yield put(
        myCommentsActions.myCommentsSuccess({ list: comments.data.result })
      );
    } catch (err) {
      yield put(myCommentsActions.myCommentsFailed(err));
    }
  });
}

export default function* myCommentsSagas() {
  yield all([getMyComments()]);
}
