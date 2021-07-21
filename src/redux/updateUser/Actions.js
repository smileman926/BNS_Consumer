import updateUserTypes from "./Types";

const updateUserRequest = (payload) => ({
  type: updateUserTypes.UPDATE_USER_REQUEST,
  payload,
});

const updateUserSuccess = (payload) => ({
  type: updateUserTypes.UPDATE_USER_SUCCESS,
  payload,
});

const updateUserFailed = (payload) => ({
  type: updateUserTypes.UPDATE_USER_FAILED,
  payload,
});

const updateUserActions = {
  updateUserRequest,
  updateUserSuccess,
  updateUserFailed,
};
export default updateUserActions;
