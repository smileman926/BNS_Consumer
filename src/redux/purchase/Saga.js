import { all, call, put, takeEvery } from "redux-saga/effects";
import {
  getPurchaseHistoryApi,
  getWebinarWinnerHistoryApi,
} from "utils/services/purchaseApi";
import purchaseActions from "./Actions";
import purchaseActionTypes from "./Types";

export function* fetchPurchasHistory() {
  yield takeEvery(purchaseActionTypes.PURCHASE_HISTORY_REQUEST, function* ({
    payload,
  }) {
    try {
      const purchases = yield call(getPurchaseHistoryApi, payload);
      yield put(purchaseActions.getPurchaseHistorySuccess(purchases));
    } catch (err) {
      yield put(purchaseActions.getPurchaseHistoryFailed());
    }
  });
}

export function* fetchWebinarWinnerHistory() {
  yield takeEvery(
    purchaseActionTypes.WEBINAR_WINNER_HISTORY_REQUEST,
    function* ({ payload }) {
      try {
        const purchases = yield call(getWebinarWinnerHistoryApi, payload);

        yield put(purchaseActions.getWebinarWinnerSuccess(purchases));
      } catch (err) {
        yield put(purchaseActions.getWebinarWinnerFailed());
      }
    }
  );
}

export default function* purchaseSagas() {
  yield all([fetchPurchasHistory(), fetchWebinarWinnerHistory()]);
}
