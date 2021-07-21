import types from './Types';

const initState = {
  user: {},
  productComments: [],
  isPosting: false,
  notifications: [],
  purchaseHistory: [],
  webinarWinnerHistory: [],
  isLoading: false,
};

const userReducer = (state = initState, {type, payload}) => {
  switch (type){
    case types.NOTIFICATION_GET_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.NOTIFICATION_GET_SUCCESS:
      return {
        ...state,
        notifications: payload.data,
        isLoading: false,
      };
    case types.NOTIFICATION_GET_FAILED:
      return {
        ...state,
        isPosting: false,
        isLoading: false,
      };


    case types.NOTIFICATION_READ_REQUEST:
      return {
        ...state,
        isLoading:true
      }
    case types.NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        productComments: payload.data,
      }
    case types.NOTIFICATION_READ_FAILED:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state;
  }
}

export default userReducer;
