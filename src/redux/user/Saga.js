import { select, all, call, put, takeEvery } from "redux-saga/effects";
import { getNotificationApi, readNotificationApi } from "utils/services/userApi";
import actions from "./Actions";
import types from "./Types";

export function* fetchNotifications() {
  yield takeEvery(types.NOTIFICATION_GET_REQUEST, function* ({ payload }) {
    try {
      const notifications = yield call(getNotificationApi, payload);
      const result = notifications.message;
      yield put(actions.getNotificationsSuccess({ data: result }));
    } catch (err) {
      yield put(actions.getNotificationsFailed());
    }
  });
}

export function* setReadNotification() {
  yield takeEvery(types.NOTIFICATION_READ_REQUEST, function* ({ payload }) {
    try {
      const users = yield call(readNotificationApi, payload);
      yield put(actions.setReadNotificationSuccess(users));
      const state = yield select();
      yield put({ type: types.NOTIFICATION_GET_REQUEST, payload: state.auth.user.id })
    } catch (err) {
      yield put(actions.setReadNotificationFailed());
    }
  });
}

export default function* userSagas() {
  yield all([fetchNotifications(), setReadNotification()]);
}
