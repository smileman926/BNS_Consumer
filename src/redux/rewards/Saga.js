import { takeEvery, call, put, all } from "redux-saga/effects";
import * as ACTIONS from "./Actions";
import * as TYPES from "./Types";
import { apiRewards } from "utils/services/api";

export function* getRewardsSaga() {
  yield takeEvery(TYPES.GET_REWARDS_REQUEST, function* () {
    try {
      const data = yield call(apiRewards);
      yield put(ACTIONS.rewardsSuccess(data));
    } catch (err) {
      yield put(ACTIONS.rewardsError(err));
    }
  });
}

export default function* saga() {
  yield all([getRewardsSaga()]);
}
