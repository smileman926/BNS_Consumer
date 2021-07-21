import * as TYPES from './Types';

const initState = {
  products: [],
  count: 0,
  isLoading: false,
  offset: 0,
  limit: 0,
  detail: {},
  showModal: false,
  scrollAndOffset: null
};

const productReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case TYPES.PRODUCT_LIST_REQUEST:
      return {
        ...state,
        offset: payload.offset,
        limit: payload.limit,
        isLoading: true,
      };
    case TYPES.PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        products: payload.data,
        count: payload.count,
      };
    case TYPES.PRODUCT_LIST_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case TYPES.PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case TYPES.BUY_PRODUCTS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case TYPES.BUY_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case TYPES.BUY_PRODUCTS_FAILED:
      return {
        ...state,
        isLoading: false,
        err: payload,
      };
    case TYPES.SHOW_MODAL:
      return {
        ...state,
        showModal: true,
      };
    case TYPES.HIDE_MODAL:
      return {
        ...state,
        showModal: false,
      };
    case TYPES.SET_SCROLL_AND_OFFSET:
      return {
        ...state,
        scrollAndOffset: { scroll: payload.scroll, offset: payload.offset, filter: payload.filter},
      };
    case TYPES.INFINITE_SCROLL_AND_OFFSET:
      return {
        ...state,
        scrollAndOffset: null,
      };
    case TYPES.CHECK_PROMO_SUCCESS:
      return {
        ...state,
        promo: payload,
      };
      case TYPES.CLEAR_PROMO:
      return {
        ...state,
        promo: '',
      };
    case TYPES.CHECK_PROMO_ERROR:
      return {
        ...state,
        err: payload,
      };
    case TYPES.PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        detail: payload.data,
      };
    case TYPES.PRODUCT_DETAIL_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default productReducer;
