import updateUserTypes from "./Types";

const initialState = {
  isLoaded: false,
  err: null,
  isEnded: false,
  isSuccess: null
};

const updateUserReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case updateUserTypes.UPDATE_USER_REQUEST:
      return {
        isLoaded: true,
        err: null,
        isEnded: false,
        isSuccess: null,
      };
    case updateUserTypes.UPDATE_USER_SUCCESS:
      return {
        isLoaded: false,
        err: null,
        isEnded: true,
        isSuccess: 'Success'
      };
    case updateUserTypes.UPDATE_USER_FAILED:
      return {
        isLoaded: false,
        err: payload,
        isEnded: true,
        isSuccess: null
      };

    default:
      return state;
  }
};

export default updateUserReducer;
