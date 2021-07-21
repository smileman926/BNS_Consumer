import {all, call, put, takeEvery} from 'redux-saga/effects';
import * as TYPES from './Types';
import * as ACTIONS from './Actions';
import {apiGetFAQs} from '../../utils/services/api';

function* getFAQs() {
  yield takeEvery(TYPES.GET_FAQ_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetFAQs, payload);
      yield put(ACTIONS.getFAQsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getFAQsError(err));
    }
  });
}
export default function* rootFAQsSaga() {
  yield all([getFAQs()]);
}
