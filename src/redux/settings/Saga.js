import { all, call, put, takeEvery } from "redux-saga/effects";

import * as settingsTypes from "./Types";
import * as settingsActions from "./Actions";

import { getAllSettings } from "utils/services/api";

export function* getSettingsSaga() {
  yield takeEvery(settingsTypes.SETTINGS_REQUEST, function* () {
    try {
      const res = yield call(getAllSettings);
      yield put(settingsActions.settingsSuccess(res.data));
    } catch (err) {}
  });
}

export default function* settingsSaga() {
  yield all([getSettingsSaga()]);
}
