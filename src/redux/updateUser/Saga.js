import { all, call, put, takeEvery } from "redux-saga/effects";
import { updateUserFields } from "./../../utils/services/api";
import updateUserTypes from "./Types";

export function* updateUser() {
  yield takeEvery(updateUserTypes.UPDATE_USER_REQUEST, function* ({ payload }) {
    try {
      const req = yield call(updateUserFields, payload);
      const { message } = req;
      yield put({
        type: updateUserTypes.UPDATE_USER_SUCCESS,
        payload: message,
      });
    } catch (err) {
      yield put({ type: updateUserTypes.UPDATE_USER_FAILED });
    }
  });
}

export default function* rootUpdateUserSaga() {
  yield all([updateUser()]);
}
