import * as TYPES from "./Types";

export const getFAQs = (payload) => ({
  type: TYPES.GET_FAQ_REQUEST,
  payload,
});

export const getFAQsSuccess = (payload) => ({
  type: TYPES.GET_FAQ_SUCCESS,
  payload,
});

export const getFAQsError = (payload) => ({
  type: TYPES.GET_FAQ_ERROR,
  payload,
});
