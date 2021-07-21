import { all, call, put, takeEvery } from "redux-saga/effects";
import { apiSignUp, apiLogIn } from "utils/services/authApi";
import authTypes from "./Types";
import authActions from "./Actions";
import { apiLogOut } from "utils/services/api";

export function* register() {
  yield takeEvery(authTypes.REGISTER_REQUEST, function* ({ payload }) {
    try {
      const userData = yield call(apiSignUp, payload);
      yield put(authActions.registerSuccess(userData));
    } catch (err) {
      yield put(authActions.registerFailed(err));
    }
  });
}

export function* login() {
  yield takeEvery(authTypes.LOGIN_REQUEST, function* ({ payload }) {
    try {
      const userData = yield call(apiLogIn, payload);
      if (userData) {
        yield put(authActions.loginSuccess(userData));
      } else {
        yield put(authActions.loginFailed({ message: "User not found!" }));
      }
    } catch (err) {
      yield put(authActions.loginFailed(err));
    }
  });
}

export function* logout() {
  yield takeEvery(authTypes.LOGOUT_REQUEST, function* ({ payload }) {
    try {
      yield call(apiLogOut, payload);
      yield put(authActions.logoutSuccess());
    } catch (err) {
      yield put(authActions.logoutFailed(err));
    }
  });
}

export default function* rootAuthSaga() {
  yield all([register(), login(), logout()]);
}
