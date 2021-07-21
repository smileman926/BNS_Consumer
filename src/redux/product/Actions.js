import * as TYPES from './Types';

const getProductsRequest = (payload) => ({
  type: TYPES.PRODUCT_LIST_REQUEST,
  payload,
});
const getProductsSuccess = (payload) => ({
  type: TYPES.PRODUCT_LIST_SUCCESS,
  payload,
});
const getProductsFailed = (payload) => ({
  type: TYPES.PRODUCT_LIST_FAILED,
  payload,
});

const getProductDetailRequest = (payload) => ({
  type: TYPES.PRODUCT_DETAIL_REQUEST,
  payload,
});
const getProductDetailSuccess = (payload) => ({
  type: TYPES.PRODUCT_DETAIL_SUCCESS,
  payload,
});
const getProductDetailFailed = (payload) => ({
  type: TYPES.PRODUCT_DETAIL_FAILED,
  payload,
});

export const buyProductsSuccess = (payload, meta) => ({
  type: TYPES.BUY_PRODUCTS_SUCCESS,
  payload,
  meta,
});
export const buyProducts = (payload, meta) => ({
  type: TYPES.BUY_PRODUCTS_REQUEST,
  payload,
  meta,
});
export const buyProductsErr = (payload, meta) => ({
  type: TYPES.BUY_PRODUCTS_FAILED,
  payload,
  meta,
});
export const clearPromo = () => ({
  type: TYPES.CLEAR_PROMO,
});
export const showModal = () => ({
  type: TYPES.SHOW_MODAL,
});
export const hideModal = () => ({
  type: TYPES.HIDE_MODAL,
});

export const setScrollAndOffset = (payload) => ({
  type: TYPES.SET_SCROLL_AND_OFFSET,
  payload
});

export const infiniteScrollAndOffset = () => ({
  type: TYPES.INFINITE_SCROLL_AND_OFFSET,
});

export const checkPromoCode = (payload) => ({
  type: TYPES.CHECK_PROMO_REQUEST,
  payload,
});
export const checkPromoCodeSuccess = (payload) => ({
  type: TYPES.CHECK_PROMO_SUCCESS,
  payload,
});
export const checkPromoCodeError = (payload) => ({
  type: TYPES.CHECK_PROMO_ERROR,
  payload,
});

const productActions = {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailed,

  getProductDetailRequest,
  getProductDetailSuccess,
  getProductDetailFailed,
};

export default productActions;
