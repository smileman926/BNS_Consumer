import authTypes from "./Types";
import updateUserTypes from "@redux/updateUser/Types";

const initState = {
  user: null,
  isLoggedIn: false,
  registerStatus: false,
  errorMsg: null,
  successMsg: null,
  loading: false,
};

const authReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case updateUserTypes.UPDATE_USER_SUCCESS:
      return { ...state, user: payload };

    case authTypes.REGISTER_REQUEST:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        registerStatus: false,
        errorMsg: null,
      };

    case authTypes.REGISTER_SUCCESS:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        registerStatus: payload,
        errorMsg: null,
      };

    case authTypes.REGISTER_FAILED:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        registerStatus: false,
        errorMsg: payload,
      };

    case authTypes.VERIFY_MAIL_SUCCESS:
      return {
        ...state,
        sucessMsg: payload,
        errorMsg: null,
      };

    case authTypes.VERIFY_MAIL_FAILED:
      return {
        ...state,
        registerStatus: false,
        sucessMsg: null,
        errorMsg: payload,
      };
    case authTypes.LOGIN_REQUEST:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        errorMsg: null,
        loading: true
      };

    case authTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: payload,
        isLoggedIn: true,
        errorMsg: null,
        loading: false,
      };

    case authTypes.LOGIN_FAILED:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        loading: false,
        errorMsg: payload,
      };

    case authTypes.LOGOUT_REQUEST:
      return {
        ...state,
        errorMsg: null,
      };

    case authTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        errorMsg: null,
      };

    case authTypes.LOGOUT_FAILED:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        errorMsg: null,
      };

    default:
      return state;
  }
};

export default authReducer;
