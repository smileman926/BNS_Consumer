import commentActionTypes from "./Types";

const initState = {
  comment: {},
  productComments: [],
  isPosting: false,
};

const commentReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case commentActionTypes.COMMENT_POST_REQUEST:
      return {
        ...state,
        isPosting: true,
      };
    case commentActionTypes.COMMENT_POST_SUCCESS:
      return {
        ...state,
        isPosting: false,
        count: payload.count,
      };
    case commentActionTypes.COMMENT_POST_FAILED:
      return {
        ...state,
        isPosting: false,
      };

    case commentActionTypes.COMMENT_WITH_PRODUCT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case commentActionTypes.COMMENT_WITH_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productComments: payload.data,
      };
    case commentActionTypes.COMMENT_WITH_PRODUCT_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case commentActionTypes.COMMENT_WITH_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case commentActionTypes.COMMENT_WITH_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        detail: payload.data,
      };
    case commentActionTypes.COMMENT_WITH_USER_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default commentReducer;
