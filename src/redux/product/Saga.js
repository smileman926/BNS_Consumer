import {all, call, put, takeEvery,} from 'redux-saga/effects';
import {getAllProductsApi, getProductDetailApi,} from 'utils/services/productApi';
import {clearCart} from '@redux/cart/Actions';
import productActions, {buyProductsErr, checkPromoCodeError, checkPromoCodeSuccess, clearPromo,} from './Actions';
import * as TYPES from './Types';
import {apiGetPromoCode, buyGoods} from '../../utils/services/api';

export function* fetchProducts() {
  yield takeEvery(TYPES.PRODUCT_LIST_REQUEST, function* ({
    payload,
  }) {
    try {
      const products = yield call(getAllProductsApi, payload);
      yield put(productActions.getProductsSuccess(products));
    } catch (err) {
      yield put(productActions.getProductsFailed());
    }
  });
}
export function* getProductDetail() {
  yield takeEvery(TYPES.PRODUCT_DETAIL_REQUEST, function* ({
    payload,
  }) {
    try {
      const product = yield call(getProductDetailApi, payload);
      yield put(productActions.getProductDetailSuccess(product));
    } catch (err) {
      yield put(productActions.getProductDetailFailed());
    }
  });
}
export function* checkPromo() {
  yield takeEvery(TYPES.CHECK_PROMO_REQUEST, function* ({
    payload,
  }) {
    try {
      const product = yield call(apiGetPromoCode, payload);
      yield put(checkPromoCodeSuccess(product));
    } catch (err) {
      yield put(checkPromoCodeError(err?.response?.data?.message));
    }
  });
}
export function* buyProducts() {
  yield takeEvery(TYPES.BUY_PRODUCTS_REQUEST, function* ({
    payload,
    meta,
  }) {
    try {
      const res = yield payload.sendData();
      yield call(buyGoods, ({
        ...payload,
        opaqueData: res.opaqueData,
      }));
      yield put(clearPromo());
      yield put(clearCart());
      yield meta.onSuccess();
    } catch (err) {
      yield put(buyProductsErr(err?.response?.data?.message));
    }
  });
}
export default function* productSagas() {
  yield all([fetchProducts(), getProductDetail(), buyProducts(), checkPromo()]);
}
