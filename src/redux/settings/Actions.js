import * as settingsTypes from "./Types";

export const settingsRequest = (payload) => ({
  type: settingsTypes.SETTINGS_REQUEST,
});


export const settingsSuccess = (payload) => ({
  type: settingsTypes.SETTINGS_SUCCESS,
  payload
})
