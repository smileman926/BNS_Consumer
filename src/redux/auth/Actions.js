import authTypes from "./Types";

const registerRequest = (payload) => ({
  type: authTypes.REGISTER_REQUEST,
  payload,
});
const registerSuccess = (payload) => ({
  type: authTypes.REGISTER_SUCCESS,
  payload,
});
const registerFailed = (payload) => ({
  type: authTypes.REGISTER_FAILED,
  payload,
});
const loginRequest = (payload) => ({ type: authTypes.LOGIN_REQUEST, payload });
const loginSuccess = (payload) => ({ type: authTypes.LOGIN_SUCCESS, payload });
const loginFailed = (payload) => ({ type: authTypes.LOGIN_FAILED, payload });
const logoutRequest = (payload) => ({ type: authTypes.LOGOUT_REQUEST, payload });
const logoutSuccess = () => ({ type: authTypes.LOGOUT_SUCCESS });
const logoutFailed = (payload) => ({ type: authTypes.LOGOUT_FAILED, payload });

const authActions = {
  registerRequest,
  registerSuccess,
  registerFailed,
  loginRequest,
  loginSuccess,
  loginFailed,
  logoutRequest,
  logoutSuccess,
  logoutFailed,
};

export default authActions;
